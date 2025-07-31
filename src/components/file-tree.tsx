"use client";

import {
  type Editable,
  type UseEditableReturn,
  useEditable,
} from "@ark-ui/react/editable";
import { type UseMenuReturn, useMenu } from "@ark-ui/react/menu";
import {
  type CreateToasterReturn,
  createToaster,
  Toaster,
} from "@ark-ui/react/toast";
import { type TreeView, useTreeView } from "@ark-ui/react/tree-view";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  FileEarmark,
  Folder,
  InfoCircle,
} from "react-bootstrap-icons";

import {
  EditableArea,
  EditableInput,
  EditableRootProvider,
} from "@/components/ui/editable";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRootProvider,
} from "@/components/ui/menu";
import { ToastDescription, ToastRoot, ToastTitle } from "@/components/ui/toast";
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
  TreeViewRootProvider,
  TreeViewTree,
} from "@/components/ui/tree";
import { useFileTree } from "@/hooks/use-file-tree";
import { cn } from "@/lib/utils";

interface TreeViewNode {
  value: string;
  label: string;
  children?: TreeViewNode[];
}

type ActiveEdit = {
  node: TreeViewNode;
  intent: "rename" | "create-file" | "create-folder";
} | null;

type TreeViewContextMenuProps = {
  menu: UseMenuReturn;
  focusedNode?: TreeViewNode;
};

const toaster = createToaster({
  placement: "top",
  gap: 16,
});

const TreeNode = (
  props: TreeView.NodeProviderProps<TreeViewNode> & {
    menu: UseMenuReturn;
    editable: UseEditableReturn;
    activeEditing: ActiveEdit;
  },
) => {
  const { node, indexPath, menu, editable, activeEditing } = props;

  const isEditing = activeEditing?.node.value === node.value;
  const isRenaming = isEditing && activeEditing.intent === "rename";
  const isCreatingFile = isEditing && activeEditing.intent === "create-file";
  const isCreatingFolder =
    isEditing && activeEditing.intent === "create-folder";

  return (
    <TreeViewNodeProvider<TreeViewNode> indexPath={indexPath} node={node}>
      {node.children ? (
        <TreeViewBranch>
          <EditableRootProvider value={editable}>
            <EditableArea className="flex">
              <button
                {...menu.api.getContextTriggerProps()}
                className={cn("w-full", isRenaming && "w-auto")}
              >
                <TreeViewBranchControl>
                  <TreeViewBranchIndicator className="transition-transform data-[state=open]:rotate-90">
                    <ChevronRight className="size-4" />
                  </TreeViewBranchIndicator>
                  <TreeViewBranchText>
                    <Folder className="size-4" />
                    {!isRenaming && node.label}
                  </TreeViewBranchText>
                </TreeViewBranchControl>
              </button>

              {isRenaming && (
                <EditableInput
                  className="h-7 self-center"
                  defaultValue={node.label}
                />
              )}
            </EditableArea>
          </EditableRootProvider>

          <TreeViewBranchContent>
            <TreeViewBranchIndentGuide />

            {(isCreatingFile || isCreatingFolder) && (
              <EditableRootProvider value={editable}>
                <EditableArea className="flex gap-2 items-center px-2 py-1">
                  {isCreatingFile ? (
                    <FileEarmark className="shrink-0 size-4" />
                  ) : (
                    <>
                      <ChevronRight className="shrink-0 size-4" />
                      <Folder className="shrink-0 size-4" />
                    </>
                  )}
                  <EditableInput className="h-7 self-center" />
                </EditableArea>
              </EditableRootProvider>
            )}

            {node.children
              ?.filter((child) => child.label !== ".emptyFolderPlaceholder")
              ?.map((child, index) => (
                <TreeNode
                  activeEditing={activeEditing}
                  editable={editable}
                  indexPath={[...indexPath, index]}
                  key={child.value}
                  menu={menu}
                  node={child}
                />
              ))}
          </TreeViewBranchContent>
        </TreeViewBranch>
      ) : (
        <EditableRootProvider value={editable}>
          <EditableArea className="flex">
            <button
              {...menu.api.getContextTriggerProps()}
              className={cn("w-full", isRenaming && "w-auto")}
            >
              <TreeViewItem>
                <TreeViewItemText>
                  <FileEarmark className="size-4" />
                  {!isRenaming && node.label}
                </TreeViewItemText>
              </TreeViewItem>
            </button>

            {isRenaming && (
              <EditableInput
                className="h-7 self-center"
                defaultValue={node.label}
              />
            )}
          </EditableArea>
        </EditableRootProvider>
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
          handleEditStart("rename");
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

  function handleEditStart(intent: "rename" | "create-file" | "create-folder") {
    if (intent === "create-file" || intent === "create-folder") {
      tree.expand([focusedNode?.value || ""]);
    }

    setActiveEdit({
      node: focusedNode ?? { value: "", label: "" },
      intent,
    });

    editable.edit();
  }

  async function handleEditSubmit(details: Editable.ValueChangeDetails) {
    const node: TreeViewNode | undefined = activeEdit?.node;
    const newLabel = details.value.trim();
    const isFolder = collection.isBranchNode(node?.value);

    if (activeEdit && node) {
      switch (activeEdit?.intent) {
        case "rename":
          if (!isFolder) {
            await rename(node, newLabel);
          }
          break;
        case "create-file":
          await create(node, newLabel);
          break;
        case "create-folder":
          await create(node, `${newLabel}/.emptyFolderPlaceholder`);
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

      <TreeViewTree>
        {collection.rootNode.children
          ?.filter(
            (node: TreeViewNode) => node.label !== ".emptyFolderPlaceholder",
          )
          ?.map((node: TreeViewNode, index: number) => (
            <TreeNode
              activeEditing={activeEdit}
              editable={editable}
              indexPath={[index]}
              key={node.value}
              menu={menu}
              node={node}
            />
          ))}

        {activeEdit?.node.value === "" &&
          (activeEdit?.intent === "create-file" ||
            activeEdit?.intent === "create-folder") && (
            <EditableRootProvider value={editable}>
              <EditableArea className="flex gap-2 items-center px-2 py-1">
                {activeEdit.intent === "create-file" ? (
                  <FileEarmark className="shrink-0 size-4" />
                ) : (
                  <>
                    <ChevronRight className="shrink-0 size-4" />
                    <Folder className="shrink-0 size-4" />
                  </>
                )}
                <EditableInput className="h-7 self-center" />
              </EditableArea>
            </EditableRootProvider>
          )}
      </TreeViewTree>

      <button
        {...menu.api.getContextTriggerProps()}
        className="size-full min-h-8"
        onFocus={() => {
          setFocusedNode({ value: "", label: "" });
        }}
      />
      <TreeViewContextMenu focusedNode={focusedNode} menu={menu} />
      <TreeViewToaster toaster={toaster} />
    </TreeViewRootProvider>
  );
};

function TreeViewContextMenu({ menu, focusedNode }: TreeViewContextMenuProps) {
  const isFolder = focusedNode?.children !== undefined;
  const isRoot = focusedNode?.value === "";
  return (
    <MenuRootProvider value={menu}>
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
    </MenuRootProvider>
  );
}

function TreeViewToaster({ toaster }: { toaster: CreateToasterReturn }) {
  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <ToastRoot key={toast.id}>
          <InfoCircle />
          <ToastTitle>{toast.title}</ToastTitle>
          <ToastDescription>{toast.description}</ToastDescription>
        </ToastRoot>
      )}
    </Toaster>
  );
}
