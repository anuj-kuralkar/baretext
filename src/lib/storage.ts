"use server";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "files";

async function prefixName(name: string) {
  const { user, error } = await getUser();
  if (!error && user?.id) {
    return `${user.id}/${name}`;
  }
  return "";
}

export async function createFolder(name: string) {
  const supabase = await createClient();

  const prefixedName = await prefixName(name);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(`${prefixedName}/.keep`, new Blob([""]));

  return { data, error };
}

export async function createFile(
  name: string,
  content: Blob,
  contentType = "text/plain",
) {
  const supabase = await createClient();

  const prefixedName = await prefixName(name);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(prefixedName, content, {
      contentType,
    });

  return { data, error };
}

export async function renameFile(oldName: string, newName: string) {
  const supabase = await createClient();

  const oldPrefixed = await prefixName(oldName);
  const newPrefixed = await prefixName(newName);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .move(oldPrefixed, newPrefixed);

  return { data, error };
}

export async function deleteFile(name: string) {
  const supabase = await createClient();

  const prefixedName = await prefixName(name);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .remove([prefixedName]);

  return { data, error };
}

export async function deleteFolder(name: string) {
  const supabase = await createClient();

  const prefixedName = await prefixName(name);

  const { data: listData, error: listError } = await supabase.rpc(
    "list_objects",
    {
      bucketid: BUCKET,
      prefix: prefixedName,
    },
  );

  if (listError) {
    return { data: null, error: listError };
  }

  const fullPaths = listData.map((item: { name: string }) => item.name);

  const { data, error } = await supabase.storage.from(BUCKET).remove(fullPaths);

  return { data, error };
}

export async function listFiles(
  prefix = "",
  limit = 100,
  offset = 0,
  recursive = true,
) {
  const supabase = await createClient();

  const prefixedPrefix = await prefixName(prefix);

  if (recursive) {
    const { data, error } = await supabase.rpc("list_objects", {
      bucketid: BUCKET,
      prefix: prefixedPrefix,
      limits: limit,
      offsets: offset,
    });

    return { data, error };
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(prefixedPrefix, {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

  return { data, error };
}
