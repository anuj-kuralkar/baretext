export type Result<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export const ok = <T>(data: T): Result<T> => ({ data, error: null });
export const err = (error: string): Result<never> => ({ data: null, error });
