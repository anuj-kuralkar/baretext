import { Editable } from "@ark-ui/react/editable";

import { cn } from "@/lib/utils";

function EditableArea({ ...props }: Editable.AreaProps) {
  return <Editable.Area {...props} />;
}

function EditableCancelTrigger(props: Editable.CancelTriggerProps) {
  return <Editable.CancelTrigger {...props} />;
}

function EditableContext(props: Editable.ContextProps) {
  return <Editable.Context {...props} />;
}

function EditableControl({ ...props }: Editable.ControlProps) {
  return <Editable.Control {...props} />;
}

function EditableEditTrigger({ ...props }: Editable.EditTriggerProps) {
  return <Editable.EditTrigger {...props} />;
}

function EditableInput({
  className,
  ...props
}: Editable.InputProps & React.RefAttributes<HTMLInputElement>) {
  return (
    <Editable.Input
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

function EditableLabel({ ...props }: Editable.LabelProps) {
  return <Editable.Label {...props} />;
}

function EditablePreview({ ...props }: Editable.PreviewProps) {
  return <Editable.Preview {...props} />;
}

function EditableRoot({ ...props }: Editable.RootProps) {
  return <Editable.Root {...props} />;
}

function EditableRootProvider({ ...props }: Editable.RootProviderProps) {
  return <Editable.RootProvider {...props} />;
}

function EditableSubmitTrigger(props: Editable.SubmitTriggerProps) {
  return <Editable.SubmitTrigger {...props} />;
}

export {
  EditableArea,
  EditableCancelTrigger,
  EditableContext,
  EditableControl,
  EditableEditTrigger,
  EditableInput,
  EditableLabel,
  EditablePreview,
  EditableRoot,
  EditableRootProvider,
  EditableSubmitTrigger,
};
