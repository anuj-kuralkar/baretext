import { auth } from "@baretext/auth";
import { createAuthorize, createAuthPlugin } from "@y/hub";

const docPermissions = {
  rw: {
    type: "permissions:document:v1",
    ydoc: "cru-",
    awareness: "-ru-",
    history: { from: 0, version: "crud" },
    endpoint: { "*": "crud" },
  },
  r: {
    type: "permissions:document:v1",
    ydoc: "-r--",
    awareness: "-ru-",
    history: { from: 0, version: "-r--" },
    endpoint: { "*": "-r--" },
  },
} as const;

export const authPlugin = createAuthPlugin({
  async authenticate(req) {
    const headers = new Headers();
    const cookie = req.getHeader("cookie");
    if (cookie) headers.set("cookie", cookie);

    const session = await auth.api.getSession({ headers });
    if (!session) return null;
    return { userid: session.user.id };
  },

  authorize: createAuthorize({
    document: async (docRef, user) => {
      if (!user) return null;
      if (docRef.org !== user.userid) return null;
      return docPermissions.rw;
    },
  }),
});
