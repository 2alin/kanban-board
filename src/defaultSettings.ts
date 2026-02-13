import type { BoardData } from "./storage/board.types";


/**
 * Valid theme values
 */
export const themes = ["light-1", "dark-1",];

/**
 * Default theme value
 */
export const defaultTheme = themes[1];

/**
 * Default board data
 */
export const defaultBoardData: BoardData = {
  version: "0.3",
  categories: [
    { isCollapsed: false, title: "Backlog" },
    { isCollapsed: false, title: "Todo" },
    { isCollapsed: false, title: "Today" },
    { isCollapsed: false, title: "Done" },
  ],
  entries: [
    {
      orderInCategory: 0,
      categoryIdx: 0,
      title: "Welcome to your Kanban Board",
      description:
        "This is an example of a card that you can have in this board.\n\n" +
        "To add a card just click on the big plus sign at the top left of this board.\n\n" +
        "The card content description support rich text ✨\n\n" +
        "✅ For bold text, wrap the text with double star or double underscore characters: `**bold**` or `__bold__` will be shown as **bold**.\n" +
        "✅ For italic text,  wrap the text with single star or single underscore characters: `*italic*` or `_italic_` will be shown as *italic*.\n" +
        "✅ For unformatted text,  wrap the text with single grave accent characters: ``code`` will be shown as `code`.\n" +
        "✅ For links, just write the full URL of the link: `https://example.com` will be shown as https://example.com\n\n" +
        "I hope that this app is helpful for you .\n" +
        "Enjoy!\n",
    },
  ],
};
