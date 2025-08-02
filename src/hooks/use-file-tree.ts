import {
  createFileTreeCollection,
  type TreeCollection,
} from "@ark-ui/react/tree-view";
import type { StorageError } from "@supabase/storage-js";
import { useEffect, useState } from "react";

import {
  createFile,
  createFolder,
  deleteFile,
  deleteFolder,
  listFiles,
  renameFile,
  renameFolder,
} from "@/lib/storage";

interface TreeViewNode {
  value: string;
  label: string;
  children?: TreeViewNode[];
}

export function useFileTree(rootValue: string) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [collection, setCollection] = useState<TreeCollection>(
    createFileTreeCollection([]),
  );

  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      const { data: files, error: loadError } = await listFiles(rootValue);
      if (loadError) {
        setError(loadError.message);
        setIsLoading(false);
        return;
      }
      if (files) {
        setCollection(createFileTreeCollection(files));
      }
      setIsLoading(false);
    };
    loadFiles();
  }, [rootValue]);

  function create(node: TreeViewNode, label: string) {
    (async () => {
      setIsLoading(true);

      const isFolder = label.endsWith("/.emptyFolderPlaceholder");
      const isRoot = node.value === rootValue;
      const displayLabel = isFolder
        ? label.replace("/.emptyFolderPlaceholder", "")
        : label;
      const newPath = `${node.value}/${displayLabel}`;

      if (!displayLabel) {
        setError("Label cannot be empty.");
        setIsLoading(false);
        return;
      }
      if (displayLabel.includes("/")) {
        setError("Label cannot contain /");
        setIsLoading(false);
        return;
      }

      let createError: StorageError | null = null;
      if (isFolder) {
        const { error: createFolderError } = await createFolder(newPath);
        createError = createFolderError;
      } else {
        const { error: createFileError } = await createFile(
          `${node.value}/${displayLabel}`,
          new Blob(),
        );
        createError = createFileError;
      }

      if (createError) {
        setError(createError.message);
        setIsLoading(false);
        return;
      }

      const indexPath = isRoot
        ? [0]
        : collection.getIndexPath(collection.getFirstNode(node).value);

      const newNode: TreeViewNode = {
        value: newPath,
        label: displayLabel,
        ...(isFolder && {
          children: [
            {
              value: `${newPath}/.emptyFolderPlaceholder`,
              label: ".emptyFolderPlaceholder",
            },
          ],
        }),
      };

      if (indexPath) {
        const newCollection = collection.insertBefore(indexPath, [newNode]);
        if (newCollection) {
          setCollection(newCollection);
        }
      }

      setIsLoading(false);
    })();
  }

  function rename(node: TreeViewNode, newLabel: string) {
    (async () => {
      setIsLoading(true);

      if (!newLabel) {
        setError("Label cannot be empty or unchanged.");
        setIsLoading(false);
        return;
      }
      if (newLabel.includes("/")) {
        setError("Label cannot contain /");
        setIsLoading(false);
        return;
      }

      const newValue = node.value.replace(/[^/]+$/, newLabel);
      const isFolder = node.children && node.children.length > 0;

      const { error } = isFolder
        ? await renameFolder(node.value, newValue)
        : await renameFile(node.value, newValue);

      if (error) {
        setError(error.toString());
        setIsLoading(false);
        return;
      }

      const indexPath = collection.getIndexPath(node.value);
      if (indexPath) {
        const newCollection = collection.replace(indexPath, {
          value: newValue,
          label: newLabel,
          ...(isFolder && {
            children: node.children,
          }),
        });
        if (newCollection) {
          setCollection(newCollection);
        }
      }

      setIsLoading(false);
    })();
  }

  function remove(node: TreeViewNode) {
    (async () => {
      setIsLoading(true);

      if (node.children && node.children.length > 0) {
        const { error: deleteError } = await deleteFolder(node.value);
        if (deleteError) {
          setError(deleteError.message);
          setIsLoading(false);
          return;
        }
      }

      const { error: deleteError } = await deleteFile(node.value);
      if (deleteError) {
        setError(deleteError.message);
        setIsLoading(false);
        return;
      }

      const indexPath = collection.getIndexPath(node.value);
      if (indexPath) {
        const newCollection = collection.remove([indexPath]);
        if (newCollection) {
          setCollection(newCollection);
        }
      }
      setIsLoading(false);
    })();
  }

  const clearError = () => setError(null);

  return {
    isLoading,
    collection,
    error,
    clearError,
    create,
    rename,
    remove,
  };
}
