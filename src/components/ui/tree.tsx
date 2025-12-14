import { TreeView } from "@ark-ui/react/tree-view";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function TreeViewRootProvider<T>(props: TreeView.RootProviderProps<T>) {
  return <TreeView.RootProvider<T> {...props} />;
}

function TreeViewLabel({ className, ...props }: TreeView.LabelProps) {
  return (
    <TreeView.Label
      className={cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function TreeViewTree({ className, ...props }: TreeView.TreeProps) {
  return <TreeView.Tree className={cn("p-2", className)} {...props} />;
}

function TreeViewNodeProvider<T>({
  children,
  ...props
}: TreeView.NodeProviderProps<T>) {
  return (
    <TreeView.NodeProvider<T> {...props}>{children}</TreeView.NodeProvider>
  );
}

function TreeViewBranch({ className, ...props }: TreeView.BranchProps) {
  return <TreeView.Branch className={className} {...props} />;
}

function TreeViewBranchControl({
  className,
  ...props
}: TreeView.BranchControlProps) {
  return (
    <TreeView.BranchControl
      className={cn(
        "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm",
        className,
      )}
      {...props}
    />
  );
}

function TreeViewBranchIndicator({
  className,
  ...props
}: TreeView.BranchIndicatorProps) {
  return <TreeView.BranchIndicator className={className} {...props} />;
}

function TreeViewBranchIndentGuide({
  className,
  ...props
}: TreeView.BranchIndentGuideProps) {
  return (
    <TreeView.BranchIndentGuide
      className={cn(
        "absolute bg-sidebar-border h-full left-[calc((var(--depth))*0px)] w-px -translate-x-px",
        className,
      )}
      {...props}
    />
  );
}

function TreeViewBranchContent({
  className,
  ...props
}: TreeView.BranchContentProps) {
  return (
    <TreeView.BranchContent
      className={cn("ml-3.5 px-2.5 py-0.5 space-y-1 relative", className)}
      {...props}
    />
  );
}

function TreeViewBranchText({ className, ...props }: TreeView.BranchTextProps) {
  return (
    <TreeView.BranchText
      className={cn("flex items-center gap-2 text-foreground", className)}
      {...props}
    />
  );
}

function TreeViewItemText({ className, ...props }: TreeView.ItemTextProps) {
  return (
    <TreeView.ItemText
      className={cn("flex items-center gap-2 text-foreground", className)}
      {...props}
    />
  );
}

function TreeViewItem({ className, ...props }: TreeView.ItemProps) {
  return (
    <TreeView.Item
      className={cn(
        "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm data-[active=true]:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

function TreeViewNodeRenameInput({
  className,
  ...props
}: TreeView.NodeRenameInputProps) {
  return (
    <TreeView.NodeRenameInput asChild {...props}>
      <Input className={cn("h-7 self-center", className)} />
    </TreeView.NodeRenameInput>
  );
}

export {
  TreeViewRootProvider,
  TreeViewLabel,
  TreeViewTree,
  TreeViewNodeProvider,
  TreeViewBranch,
  TreeViewBranchControl,
  TreeViewBranchIndicator,
  TreeViewBranchIndentGuide,
  TreeViewBranchContent,
  TreeViewBranchText,
  TreeViewItemText,
  TreeViewItem,
  TreeViewNodeRenameInput,
};
