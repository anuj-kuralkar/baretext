"use client";

import { createToaster, Toast, Toaster } from "@ark-ui/react/toast";
import { InfoCircle } from "react-bootstrap-icons";

export function ToastRoot(props: Toast.RootProps) {
  return (
    <Toast.Root
      className="data-[state=open]:animate-in data-[state=closed]:animate-out fade-in slide-in-from-top-8 fade-out slide-out-to-top-8 duration-500 translate-y-[var(--offset)] relative w-xs rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 text-destructive bg-card [&>svg]:text-current *:data-[part=description]:text-destructive/90"
      {...props}
    />
  );
}

export function ToastTitle(props: Toast.TitleProps) {
  return (
    <Toast.Title
      className="col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight"
      {...props}
    />
  );
}

export function ToastDescription(props: Toast.DescriptionProps) {
  return (
    <Toast.Description
      className="col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed"
      {...props}
    />
  );
}

export const toaster = createToaster({
  placement: "top",
  gap: 16,
});

export function AppToaster() {
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
