import { Elysia } from "elysia";
import { betterAuth } from "../auth";
import { NoteModel } from "./model";
import { NoteService } from "./service";

const noteModels = new Elysia().model(NoteModel);

export const noteModule = new Elysia({ prefix: "/notes" })
  .use(betterAuth)
  .use(noteModels)
  .post(
    "/",
    {
      body: "createBody",
      auth: true,
    },
    async ({ body, user }) =>
      NoteService.createNote({ ...body, userId: user.id }),
  )
  .patch(
    "/:id",
    {
      params: "noteId",
      body: "updateBody",
      auth: true,
    },
    async ({ params: { id }, body, user }) =>
      NoteService.updateNote({ id, ...body, userId: user.id }),
  )
  .delete(
    "/:id",
    {
      params: "noteId",
      auth: true,
    },
    async ({ params: { id }, user }) =>
      NoteService.deleteNote({ id, userId: user.id }),
  );
