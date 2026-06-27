"use client";
import { UserIcon, UserPenIcon } from "lucide-react";
import Form from "next/form";
import { useActionState, useEffect, useRef } from "react";

import * as Avatar from "@/components/ui/avatar";
import * as Card from "@/components/ui/card";
import * as FileUpload from "@/components/ui/file-upload";
import { Spinner } from "@/components/ui/spinner";
import { toaster } from "@/components/ui/toast";
import { updateAvatar } from "@/module/user/actions";

export function AvatarUpdateForm({ src }: { src: string | undefined }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(updateAvatar, {
    inputs: {},
  });

  useEffect(() => {
    if (state.success) {
      queueMicrotask(() => {
        toaster.success({ description: "Avatar updated successfully." });
      });
    }
  }, [state.success]);

  return (
    <FileUpload.Root
      accept="image/*"
      disabled={isPending}
      maxFiles={1}
      onFileAccept={({ files }) => {
        if (files.length > 0) {
          formRef.current?.requestSubmit();
        }
      }}
    >
      <Form action={formAction} ref={formRef}>
        <Card.Root>
          <Card.Header>
            <Card.Title asChild>
              <FileUpload.Label>Avatar</FileUpload.Label>
            </Card.Title>
            <Card.Description>
              Personalize your workspace with a profile picture.
            </Card.Description>
          </Card.Header>

          <Card.Content>
            <FileUpload.Context>
              {({ acceptedFiles }) => (
                <div className="relative mx-auto size-20">
                  <FileUpload.Dropzone className="group/dropzone relative flex size-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent p-0 transition-colors hover:border-border">
                    <FileUpload.Trigger className="group/trigger relative flex size-full cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed">
                      {acceptedFiles.length > 0 ? (
                        <FileUpload.ItemGroup className="size-full">
                          <FileUpload.Item
                            className="size-full border-none bg-transparent p-0"
                            file={acceptedFiles[0]}
                          >
                            <FileUpload.ItemPreview
                              className="size-full border-none bg-transparent [&_svg]:hidden"
                              type="image/*"
                            >
                              <FileUpload.ItemPreviewImage className="size-full rounded-full object-cover" />
                            </FileUpload.ItemPreview>
                          </FileUpload.Item>
                        </FileUpload.ItemGroup>
                      ) : (
                        <Avatar.Root className="size-full">
                          <Avatar.Image src={src} />
                          <Avatar.Fallback className="bg-muted">
                            <UserIcon className="size-6 text-muted-foreground" />
                          </Avatar.Fallback>
                        </Avatar.Root>
                      )}

                      <div
                        className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-200 group-focus-visible/trigger:opacity-100 group-hover/trigger:opacity-100 group-data-dragging/dropzone:opacity-100 data-[pending=true]:opacity-100"
                        data-pending={isPending}
                      >
                        {isPending ? (
                          <Spinner
                            aria-hidden="true"
                            className="size-6 text-white"
                          />
                        ) : (
                          <UserPenIcon
                            aria-hidden="true"
                            className="size-6 text-white"
                          />
                        )}
                      </div>
                    </FileUpload.Trigger>
                  </FileUpload.Dropzone>
                </div>
              )}
            </FileUpload.Context>
          </Card.Content>

          <Card.Footer>
            <p aria-live="polite" className="text-muted-foreground">
              {isPending ? "Uploading..." : "It is resized to 256 by 256"}
            </p>
          </Card.Footer>

          <FileUpload.HiddenInput name="image" />
        </Card.Root>
      </Form>
    </FileUpload.Root>
  );
}
