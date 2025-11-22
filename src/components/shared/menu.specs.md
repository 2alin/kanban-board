# Description
This document describes the specifications around the behaviour, structure and basic style of the menu component.


# Specifications

## Structure & Style

- The component should have an anchor element (menu button) and list of option elements (menu options).

- The option elements should appear by default under the anchor, but if the screen doesn't allow it, it should should at the top of the anchor. In other words, the options should appear in a position, if possible, where the user can see them.


## Behaviour

- By default only the anchor should be visible and the options should be hidden.

- Clicking over the anchor element will make the options visible and clicking again over the anchor should hide the options.

- If the options list is open, clicking outside the options list will close the list.

- Anchor and options should be accessible by keyboard:
  - `Tab / Shift+Tab` should allow the user to focus on the menu anchor
  - `Enter` on the anchor should show/hide the menu options. The first option item should be focused by default when the options open.
  - If the options are open, 'arrow' keys should allow user to navigate through the options and `Enter` key will allow user to select the focused option.
  - If the options are open, `Escape` key should hide the options list and focus on the anchor element.
