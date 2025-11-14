import { describe, expect, it } from "vitest";

import type { BoardData_v01 } from "./storage.old.types";
import type { BoardData } from "./storage.types";
import { migrateData } from "./storage";

const boardDataV01: BoardData_v01 = {
  version: "0.1",
  categories: ["backlog", "todo", "today", "done"],
  entries: [
    {
      category: "backlog",
      title: "task-1",
      description: "Description of task-1",
      categoryIdx: 0,
    },
    {
      category: "today",
      title: "task-2",
      description: "Description of task-2",
      categoryIdx: 0,
    },
    {
      category: "today",
      title: "task-3",
      description: "Description of task-3",
      categoryIdx: 1,
    },
  ],
};

const boardDataV02: BoardData = {
  version: "0.2",
  categories: ["backlog", "todo", "today", "done"],
  entries: [
    {
      categoryIdx: 0,
      title: "task-1",
      description: "Description of task-1",
      orderInCategory: 0,
    },
    {
      categoryIdx: 2,
      title: "task-2",
      description: "Description of task-2",
      orderInCategory: 0,
    },
    {
      categoryIdx: 2,
      title: "task-3",
      description: "Description of task-3",
      orderInCategory: 1,
    },
  ],
};

describe("migrateData", () => {
  it("should convert to the expected data object", () => {
    const newBoardData = migrateData(boardDataV01);

    expect(newBoardData.version).toEqual("0.2");
    expect(newBoardData).toEqual(boardDataV02);
  });
});
