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

describe("Yjs API Service", () => {
  it("throws NoteNotFound when user does not own the note", async () => {
    const mockFrom = vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([]), // no note found
    });
    vi.mocked(db.select).mockReturnValue({
      from: mockFrom,
    } as unknown as ReturnType<typeof db.select>);

    await expect(
      getYjsLive({
        noteId: "11111111-1111-1111-1111-111111111111",
        userId: "user-123",
      }),
    ).rejects.toThrow(NoteNotFound);
  });

  it("returns sealed queries and initialUpdates for valid note ownership", async () => {
    const mockFrom = vi.fn().mockReturnValue({
      where: vi
        .fn()
        .mockResolvedValue([{ id: "11111111-1111-1111-1111-111111111111" }]),
    });
    const mockUpdatesQuery = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([
            {
              id: "update-1",
              noteId: "11111111-1111-1111-1111-111111111111",
              op: Buffer.from([1, 2, 3]),
              userId: "user-123",
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
      .mockReturnValueOnce({ from: mockFrom } as unknown as ReturnType<
        typeof db.select
      >)
      .mockReturnValueOnce(
        mockUpdatesQuery as unknown as ReturnType<typeof db.select>,
      )
      .mockReturnValueOnce(
        mockAwarenessQuery as unknown as ReturnType<typeof db.select>,
      );

    const result = await getYjsLive({
      noteId: "11111111-1111-1111-1111-111111111111",
      userId: "user-123",
    });

    expect(result).toHaveProperty("updates");
    expect(result).toHaveProperty("awareness");
    expect(result.updates).toHaveProperty("sealed", true);
    expect(result.awareness).toHaveProperty("sealed", true);
    expect(result).toHaveProperty("initialUpdates");
    expect(result.initialUpdates).toHaveLength(1);
    expect(result.initialUpdates[0]?.id).toBe("update-1");
    expect(result).toHaveProperty("initialAwareness");
  });

  it("saves doc update and returns txid", async () => {
    const mockReturning = vi.fn().mockResolvedValue([{ txid: "tx-12345" }]);
    const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
    vi.mocked(db.insert).mockReturnValue({
      values: mockValues,
    } as unknown as ReturnType<typeof db.insert>);

    const result = await saveUpdate({
      noteId: "11111111-1111-1111-1111-111111111111",
      buffer: Buffer.from([1, 2, 3]),
      userId: "user-123",
    });

    expect(result).toEqual({ txid: "tx-12345" });
  });

  it("saves awareness update and returns txid", async () => {
    const mockReturning = vi.fn().mockResolvedValue([{ txid: "tx-67890" }]);
    const mockOnConflict = vi
      .fn()
      .mockReturnValue({ returning: mockReturning });
    const mockValues = vi
      .fn()
      .mockReturnValue({ onConflictDoUpdate: mockOnConflict });
    vi.mocked(db.insert).mockReturnValue({
      values: mockValues,
    } as unknown as ReturnType<typeof db.insert>);

    const result = await saveAwareness({
      noteId: "11111111-1111-1111-1111-111111111111",
      buffer: Buffer.from([4, 5, 6]),
      userId: "user-123",
    });

    expect(result).toEqual({ txid: "tx-67890" });
  });
});
