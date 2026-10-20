import { Elysia } from "elysia";
import { authPlugin } from "../../plugins/auth";
import * as NoteModel from "./model";
import { createNote, deleteNote, updateNote } from "./service";

export const note = new Elysia({ prefix: "/notes" })
  .use(authPlugin)
  .post(
    "/",
    {
      body: NoteModel.Post.Body,
      auth: true,
    },
    async ({ body, user }) => createNote({ ...body, userId: user.id }),
  )
  .patch(
    "/:id",
    {
      params: NoteModel.ByIdPatch.Params,
      body: NoteModel.ByIdPatch.Body,
      auth: true,
    },
    async ({ params: { id }, body, user }) =>
      updateNote({ id, ...body, userId: user.id }),
  )
  .delete(
    "/:id",
    {
      params: NoteModel.ByIdDelete.Params,
      auth: true,
    },
    async ({ params: { id }, user }) => deleteNote({ id, userId: user.id }),
  );
