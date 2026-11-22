import { describe, expect, it, vi } from "vitest";

// Mock DB and realtime for unit testing service
vi.mock("@baretext/db", () => {
  return {
    db: {
      select: vi.fn(),
      insert: vi.fn(),
    },
  };
});

vi.mock("@baretext/db/realtime", () => {
  return {
    realtime: {
      seal: vi
        .fn()
        .mockImplementation(async ({ query }: { query: unknown }) => {
          return { sealed: true, query };
        }),
    },
  };
});

import { db } from "@baretext/db";
import { getYjsLive, NoteNotFound, saveAwareness, saveUpdate } from "./service";

const NOTE_ID = "11111111-1111-1111-1111-111111111111";
const USER_ID = "user-123";

function mockNoteLookup(found: boolean) {
  vi.mocked(db.select).mockReturnValueOnce({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(found ? [{ id: NOTE_ID }] : []),
    }),
  } as unknown as ReturnType<typeof db.select>);
}

describe("Yjs API Service", () => {
  it("throws NoteNotFound when user does not own the note", async () => {
    mockNoteLookup(false);

    await expect(
      getYjsLive({ noteId: NOTE_ID, userId: USER_ID }),
    ).rejects.toThrow(NoteNotFound);
  });

  it("returns sealed queries and initialUpdates for valid note ownership", async () => {
    const mockUpdatesQuery = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([
            {
              id: "update-1",
              noteId: NOTE_ID,
              op: Buffer.from([1, 2, 3]),
              userId: USER_ID,
            },
          ]),
        }),
      }),
    };
    const mockAwarenessQuery = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    };

    vi.mocked(db.select)
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ id: NOTE_ID }]),
        }),
      } as unknown as ReturnType<typeof db.select>)
      .mockReturnValueOnce(
        mockUpdatesQuery as unknown as ReturnType<typeof db.select>,
      )
      .mockReturnValueOnce(
        mockAwarenessQuery as unknown as ReturnType<typeof db.select>,
      );

    const result = await getYjsLive({ noteId: NOTE_ID, userId: USER_ID });

    expect(result).toHaveProperty("updates");
    expect(result).toHaveProperty("awareness");
    expect(result.updates).toHaveProperty("sealed", true);
    expect(result.awareness).toHaveProperty("sealed", true);
    expect(result).toHaveProperty("initialUpdates");
    expect(result.initialUpdates).toHaveLength(1);
    expect(result.initialUpdates[0]?.id).toBe("update-1");
    expect(result).toHaveProperty("initialAwareness");
  });

  it("saves doc update", async () => {
    mockNoteLookup(true);

    const mockValues = vi.fn().mockResolvedValue(undefined);
    vi.mocked(db.insert).mockReturnValue({
      values: mockValues,
    } as unknown as ReturnType<typeof db.insert>);

    const result = await saveUpdate({
      noteId: NOTE_ID,
      buffer: Buffer.from([1, 2, 3]),
      userId: USER_ID,
    });

    expect(result).toBeUndefined();
    expect(mockValues).toHaveBeenCalledWith({
      noteId: NOTE_ID,
      userId: USER_ID,
      op: Buffer.from([1, 2, 3]),
    });
  });

  it("saves awareness update", async () => {
    mockNoteLookup(true);

    const mockOnConflict = vi.fn().mockReturnValue({});
    const mockValues = vi
      .fn()
      .mockReturnValue({ onConflictDoUpdate: mockOnConflict });
    vi.mocked(db.insert).mockReturnValue({
      values: mockValues,
    } as unknown as ReturnType<typeof db.insert>);

    const result = await saveAwareness({
      noteId: NOTE_ID,
      buffer: Buffer.from([4, 5, 6]),
      userId: USER_ID,
    });

    expect(result).toBeUndefined();
    expect(mockValues).toHaveBeenCalledWith({
      op: Buffer.from([4, 5, 6]),
      noteId: NOTE_ID,
      userId: USER_ID,
    });
  });

  it("refuses to save updates for a note the user does not own", async () => {
    mockNoteLookup(false);

    await expect(
      saveUpdate({
        noteId: NOTE_ID,
        buffer: Buffer.from([1, 2, 3]),
        userId: USER_ID,
      }),
    ).rejects.toThrow(NoteNotFound);

    expect(db.insert).not.toHaveBeenCalled();
  });

  it("refuses to save awareness for a note the user does not own", async () => {
    mockNoteLookup(false);

    await expect(
      saveAwareness({
        noteId: NOTE_ID,
        buffer: Buffer.from([4, 5, 6]),
        userId: USER_ID,
      }),
    ).rejects.toThrow(NoteNotFound);

    expect(db.insert).not.toHaveBeenCalled();
  });
});
