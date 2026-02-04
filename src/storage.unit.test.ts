import { describe, expect, it } from "vitest";

import type { BoardData_v02 } from "./storage.old.types";
import type { BoardData } from "./storage.types";
import { migrateData } from "./storage";

const boardDataV02: BoardData_v02 = {
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

const boardDataV03: BoardData = {
  version: "0.3",
  categories: [
    { isCollapsed: false, title: "backlog" },
    { isCollapsed: false, title: "todo" },
    { isCollapsed: false, title: "today" },
    { isCollapsed: false, title: "done" },
  ],
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
    const newBoardData = migrateData(boardDataV02);


    // expect(newBoardData).toEqual(boardDataV03);
    expect(newBoardData).toStrictEqual(boardDataV03);
  });
});
