"use client";

import { ArrowLeftIcon } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface LoginHeaderProps {
  title: string;
  description: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
}

export function LoginHeader({
  title,
  description,
  onBack,
  backLabel = "Go back",
}: LoginHeaderProps) {
  return (
    <CardHeader className="p-0 text-left">
      {onBack && (
        <div className="-mt-1 mb-4 flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="-ml-2 text-muted-foreground transition-colors hover:text-foreground"
            onClick={onBack}
            aria-label={backLabel}
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
        </div>
      )}
      <CardTitle className="font-semibold text-2xl text-foreground tracking-tight">
        {title}
      </CardTitle>
      <CardDescription className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
        {description}
      </CardDescription>
    </CardHeader>
  );
}
