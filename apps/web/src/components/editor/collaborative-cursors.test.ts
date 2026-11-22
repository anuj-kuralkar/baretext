import { Awareness } from "@y/protocols/awareness";
import * as Y from "@y/y";
import { describe, expect, it } from "vitest";
import { getCursorColor, syncAwarenessUser } from "./collaborative-cursors";

describe("collaborative-cursors awareness user sync", () => {
  it("getCursorColor returns deterministic color based on clientID", () => {
    const color1 = getCursorColor(101);
    const color2 = getCursorColor(101);
    expect(color1).toBe(color2);
    expect(color1).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("does not set user state on awareness when session user is null or undefined", () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);

    syncAwarenessUser(awareness, null);
    expect(awareness.getLocalState()?.user).toBeUndefined();

    syncAwarenessUser(awareness, undefined);
    expect(awareness.getLocalState()?.user).toBeUndefined();

    awareness.destroy();
    doc.destroy();
  });

  it("sets user state on awareness with name and color when session user is present", () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);

    syncAwarenessUser(awareness, { name: "Alice" });

    const localState = awareness.getLocalState();
    expect(localState?.user).toEqual({
      name: "Alice",
      color: getCursorColor(awareness.clientID),
    });

    awareness.destroy();
    doc.destroy();
  });

  it("clears user state when session user transitions from present to null", () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);

    syncAwarenessUser(awareness, { name: "Bob" });
    expect(awareness.getLocalState()?.user).toBeDefined();

    syncAwarenessUser(awareness, null);
    expect(awareness.getLocalState()?.user).toBeNull();

    awareness.destroy();
    doc.destroy();
  });
});
