import { Editable } from "@ark-ui/react/editable";

import { Input } from "@/components/ui/input";

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
    <Editable.Input asChild {...props}>
      <Input className={className} />
    </Editable.Input>
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
