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
    <CardHeader className="relative text-center">
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-6 left-5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          onClick={onBack}
          aria-label={backLabel}
        >
          <ArrowLeftIcon />
        </Button>
      )}
      <CardTitle className="font-extrabold text-2xl tracking-tight">
        {title}
      </CardTitle>
      <CardDescription className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </CardDescription>
    </CardHeader>
  );
}
