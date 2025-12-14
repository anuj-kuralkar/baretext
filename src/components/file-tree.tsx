"use client";

import { type Editable, useEditable } from "@ark-ui/react/editable";
import { useMenu } from "@ark-ui/react/menu";
import {
  type TreeView,
  useTreeView,
  useTreeViewContext,
} from "@ark-ui/react/tree-view";
import { useEffect, useState } from "react";
import { ChevronRight, FileEarmark, Folder } from "react-bootstrap-icons";

import {
  EditableArea,
  EditableInput,
  EditableRootProvider,
} from "@/components/ui/editable";
import {
  MenuContent,
  MenuContextTrigger,
  MenuItem,
  MenuPositioner,
  MenuRootProvider,
} from "@/components/ui/menu";
import { toaster } from "@/components/ui/toast";
import {
  TreeViewBranch,
  TreeViewBranchContent,
  TreeViewBranchControl,
  TreeViewBranchIndentGuide,
  TreeViewBranchIndicator,
  TreeViewBranchText,
  TreeViewItem,
  TreeViewItemText,
  TreeViewLabel,
  TreeViewNodeProvider,
  TreeViewNodeRenameInput,
  TreeViewRootProvider,
  TreeViewTree,
} from "@/components/ui/tree";
import { useFileTree } from "@/hooks/use-file-tree";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/providers/editor-store";

interface TreeViewNode {
  value: string;
  label: string;
  children?: TreeViewNode[];
}

type ActiveEdit = {
  node: TreeViewNode;
  intent: "create-file" | "create-folder";
} | null;

type TreeViewContextMenuProps = {
  focusedNode?: TreeViewNode;
};

const TreeNode = (
  props: TreeView.NodeProviderProps<TreeViewNode> & {
    activeEditing: ActiveEdit;
  },
) => {
  const { node, indexPath, activeEditing } = props;
  const tree = useTreeViewContext();
  const nodeState = tree.getNodeState({ indexPath, node });

  const { setOpenFile } = useEditorStore((state) => state);

  const isEditing = activeEditing?.node.value === node.value;
  const isCreatingFile = isEditing && activeEditing.intent === "create-file";
  const isCreatingFolder =
    isEditing && activeEditing.intent === "create-folder";

  return (
    <TreeViewNodeProvider<TreeViewNode> indexPath={indexPath} node={node}>
      {node.children ? (
        <TreeViewBranch>
          <div className="flex items-center justify-between">
            <MenuContextTrigger
              className={cn("w-full", nodeState.renaming && "w-auto")}
            >
              <TreeViewBranchControl>
                <TreeViewBranchIndicator className="transition-transform data-[state=open]:rotate-90">
                  <ChevronRight className="size-4" />
                </TreeViewBranchIndicator>
                <TreeViewBranchText>
                  <Folder className="size-4" />
                  {!nodeState.renaming && node.label}
                </TreeViewBranchText>
              </TreeViewBranchControl>
            </MenuContextTrigger>

            <TreeViewNodeRenameInput />
          </div>

          <TreeViewBranchContent>
            <TreeViewBranchIndentGuide />

            {(isCreatingFile || isCreatingFolder) && (
              <div className="flex items-center justify-between gap-x-2 px-2">
                {isCreatingFile ? (
                  <FileEarmark className="shrink-0 size-4" />
                ) : (
                  <>
                    <ChevronRight className="shrink-0 size-4" />
                    <Folder className="shrink-0 size-4" />
                  </>
                )}
                <EditableInput className="h-7 self-center" />
              </div>
            )}

            {node.children
              ?.filter((child) => child.label !== ".emptyFolderPlaceholder")
              ?.map((child, index) => (
                <TreeNode
                  activeEditing={activeEditing}
                  indexPath={[...indexPath, index]}
                  key={child.value}
                  node={child}
                />
              ))}
          </TreeViewBranchContent>
        </TreeViewBranch>
      ) : (
        <div className="flex items-center justify-between">
          <MenuContextTrigger
            className={cn("w-full", nodeState.renaming && "w-auto")}
          >
            <TreeViewItem onDoubleClick={() => setOpenFile(node.value)}>
              <TreeViewItemText>
                <FileEarmark className="size-4" />
                {!nodeState.renaming && node.label}
              </TreeViewItemText>
            </TreeViewItem>
          </MenuContextTrigger>

          <TreeViewNodeRenameInput />
        </div>
      )}
    </TreeViewNodeProvider>
  );
};

export const FileTree = () => {
  const { isLoading, error, clearError, collection, create, rename, remove } =
    useFileTree("");

  useEffect(() => {
    if (error) {
      queueMicrotask(() => {
        toaster.error({
          title: "Error",
          description: error,
        });
      });
      clearError();
    }
  }, [error, clearError]);

  const [focusedNode, setFocusedNode] = useState<TreeViewNode | undefined>(
    undefined,
  );
  const [activeEdit, setActiveEdit] = useState<ActiveEdit>(null);

  const tree = useTreeView({
    collection,
    focusedValue: focusedNode?.value,
    onFocusChange: (details) => setFocusedNode(details.focusedNode),
    onRenameComplete: (details) => {
      rename(details);
    },
    onBeforeRename: (details) => {
      if (!details.label) return false;
      if (details.label === focusedNode?.label) return false;
      return true;
    },
  });

  const menu = useMenu({
    positioning: { placement: "bottom-start", strategy: "fixed" },
    onSelect: (details) => {
      switch (details.value) {
        case "create-file":
          handleEditStart("create-file");
          break;
        case "create-folder":
          handleEditStart("create-folder");
          break;
        case "rename":
          tree.startRenaming(focusedNode?.value || "");
          break;
        case "delete":
          if (focusedNode) {
            remove(focusedNode);
          }
          break;
      }
    },
  });

  const editable = useEditable({
    activationMode: "none",
    onValueCommit(details) {
      handleEditSubmit(details);
      setActiveEdit(null);
      editable.clearValue();
    },
  });

  function handleEditStart(intent: "create-file" | "create-folder") {
    tree.expand([focusedNode?.value || ""]);

    setActiveEdit({
      node: focusedNode ?? { value: "", label: "" },
      intent,
    });

    editable.edit();
  }

  async function handleEditSubmit(details: Editable.ValueChangeDetails) {
    const node: TreeViewNode | undefined = activeEdit?.node;
    const newLabel = details.value.trim();

    if (activeEdit && node) {
      switch (activeEdit?.intent) {
        case "create-file":
          create(node, newLabel);
          break;
        case "create-folder":
          create(node, `${newLabel}/.emptyFolderPlaceholder`);
          break;
      }
    }
  }

  return (
    <TreeViewRootProvider
      className={cn("flex flex-col h-full", isLoading && "animate-pulse")}
      value={tree}
    >
      <TreeViewLabel>Files</TreeViewLabel>

      <MenuRootProvider value={menu}>
        <EditableRootProvider value={editable}>
          <EditableArea>
            <TreeViewTree>
              {collection.rootNode.children
                ?.filter(
                  (node: TreeViewNode) =>
                    node.label !== ".emptyFolderPlaceholder",
                )
                ?.map((node: TreeViewNode, index: number) => (
                  <TreeNode
                    activeEditing={activeEdit}
                    indexPath={[index]}
                    key={node.value}
                    node={node}
                  />
                ))}

              {activeEdit?.node.value === "" &&
                (activeEdit?.intent === "create-file" ||
                  activeEdit?.intent === "create-folder") && (
                  <div className="flex items-center justify-between gap-x-2 px-2">
                    {activeEdit.intent === "create-file" ? (
                      <FileEarmark className="shrink-0 size-4" />
                    ) : (
                      <>
                        <ChevronRight className="shrink-0 size-4" />
                        <Folder className="shrink-0 size-4" />
                      </>
                    )}
                    <EditableInput className="h-7 self-center" />
                  </div>
                )}
            </TreeViewTree>
          </EditableArea>
        </EditableRootProvider>

        <MenuContextTrigger
          className="size-full min-h-8"
          onFocus={() => {
            setFocusedNode({ value: "", label: "" });
          }}
        />
        <TreeViewContextMenu focusedNode={focusedNode} />
      </MenuRootProvider>
    </TreeViewRootProvider>
  );
};

function TreeViewContextMenu({ focusedNode }: TreeViewContextMenuProps) {
  const isFolder = focusedNode?.children !== undefined;
  const isRoot = !focusedNode || focusedNode?.value === "";
  return (
    <MenuPositioner>
      <MenuContent>
        <MenuItem
          className={cn(!(isRoot || isFolder) && "hidden")}
          value="create-file"
        >
          New File
        </MenuItem>

        <MenuItem
          className={cn(!(isRoot || isFolder) && "hidden")}
          value="create-folder"
        >
          New Folder
        </MenuItem>

        <MenuItem className={cn(isRoot && "hidden")} value="rename">
          Rename
        </MenuItem>

        <MenuItem className={cn(isRoot && "hidden")} value="delete">
          Delete
        </MenuItem>
      </MenuContent>
    </MenuPositioner>
  );
}
