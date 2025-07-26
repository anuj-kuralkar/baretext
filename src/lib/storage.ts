"use server";

import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "files";

async function getUserPrefix(): Promise<string> {
  const { user, error } = await getUser();
  if (!error && user?.id) {
    return `${user.id}/`;
  }
  return "";
}

export async function createFile(
  name: string,
  content: Blob,
  contentType = "text/plain",
) {
  const supabase = await createClient();
  const userPrefix = await getUserPrefix();
  const prefixedName = `${userPrefix}${name}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(prefixedName, content, {
      contentType,
    });

  return { data, error };
}

export async function deleteFile(name: string) {
  const supabase = await createClient();
  const userPrefix = await getUserPrefix();
  const prefixedName = `${userPrefix}${name}`;

  return await supabase.storage.from(BUCKET).remove([prefixedName]);
}

export async function renameFile(oldName: string, newName: string) {
  return move(oldName, newName);
}

export async function createFolder(name: string) {
  const { data, error } = await createFile(
    `${name}/.emptyFolderPlaceholder`,
    new Blob(),
    "application/x-directory",
  );

  return { data, error };
}

export async function deleteFolder(name: string) {
  const supabase = await createClient();

  const { data: names, error: listError } = await listFiles(name);

  if (listError) {
    return { data: null, error: listError };
  }

  return await supabase.storage.from(BUCKET).remove(names);
}

export async function renameFolder(oldName: string, newName: string) {
  const { data: listData, error: listError } = await listFiles(oldName);

  if (listError) {
    return { data: null, error: listError };
  }

  const movePromises = listData.map(async (name: string) => {
    const relativePath = name.slice(oldName.length);
    const destination = newName + relativePath;

    return await move(name, destination);
  });

  const results = await Promise.all(movePromises);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    return { data: null, error: errors };
  }

  return { data: results.map((r) => r.data), error: null };
}

export async function listFiles(rootName = "") {
  const supabase = await createClient();
  const userPrefix = await getUserPrefix();
  const prefixedRootName = `${userPrefix}${rootName}`;

  const { data, error } = await supabase.rpc("list_objects", {
    bucketid: BUCKET,
    prefix: prefixedRootName,
  });

  if (error || !data) {
    return { data: null, error };
  }

  let names = data;

  names = names.map((name: string) => {
    return name.replace(userPrefix, "");
  });

  return { data: names, error: null };
}

export async function move(source: string, destination: string) {
  const supabase = await createClient();
  const userPrefix = await getUserPrefix();
  const prefixedSource = `${userPrefix}${source}`;
  const prefixedDestination = `${userPrefix}${destination}`;

  return supabase.storage
    .from(BUCKET)
    .move(prefixedSource, prefixedDestination);
}
