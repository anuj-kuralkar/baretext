"use client";

import { Construction, X } from "lucide-react";
import { useEffect, useState } from "react";

import * as Alert from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function DevelopmentBanner() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("banner-closed");
    if (!dismissed) setOpen(true);
  }, []);

  if (open === null) return null;
  if (!open) return null;

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("banner-closed", "true");
  };

  return (
    <Alert.Root className="rounded-none border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
      <Construction />

      <Alert.Title>I couldn't wait any longer</Alert.Title>

      <Alert.Description>
        Baretext is still being built. Things will break, things will change,
        things will get better.
      </Alert.Description>

      <Alert.Action>
        <Button
          className="size-5"
          onClick={handleClose}
          size="icon"
          variant="ghost"
        >
          <X />
          <span className="sr-only">Close banner</span>
        </Button>
      </Alert.Action>
    </Alert.Root>
  );
}
