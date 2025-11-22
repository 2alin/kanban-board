import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import Menu from "./menu";
import { page } from "vitest/browser";

describe("Menu component", () => {
  it("shows text anchor", async () => {
    await render(<Menu options={[]}>Test menu</Menu>);

    await expect
      .element(page.getByRole("button", { name: "menu" }))
      .toBeInTheDocument();

    await expect.element(page.getByText("Test menu")).toBeInTheDocument();
  });

  it("doesn't show menu options on 'closed' state", async () => {
    await render(<Menu options={[]}>Test menu</Menu>);

    await expect.element(page.getByRole("list")).not.toBeInTheDocument();
  });

  it("shows text anchor on 'open' state", async () => {
    await render(<Menu options={[]}>Test menu</Menu>);

    const anchorButton = page.getByRole("button");
    await anchorButton.click();

    await expect
      .element(page.getByRole("button", { name: "menu" }))
      .toBeInTheDocument();
    await expect.element(page.getByText("Test menu")).toBeInTheDocument();
  });

  it("shows menu options on 'open' state", async () => {
    await render(<Menu options={[]}>Test menu</Menu>);

    const anchorButton = page.getByRole("button");
    await anchorButton.click();

    await expect.element(page.getByRole("list")).toBeInTheDocument();
  });

  it("shows an icon for menu of icon type", async () => {
    await render(<Menu options={[]} isIconButton={true}></Menu>);
    const icon = document.querySelector(".icon-img");

    expect(icon instanceof HTMLElement).toBe(true);
  });

  it("should execute handlers on options click", async () => {
    const handlerA = vi.fn();
    const handlerB = vi.fn();

    const options = [
      { key: "a", text: "option A", handler: handlerA },
      { key: "b", text: "option B", handler: handlerB },
    ];

    await render(<Menu options={options}>Test menu</Menu>);

    const anchorButton = page.getByRole("button");
    await anchorButton.click();

    const optionsList = page.getByRole("list");
    const optionA = optionsList.getByText("option A");
    await expect.element(optionA).toBeInTheDocument();
    await optionA.click();
    expect(handlerA).toBeCalled();

    // menu got closed after previous option click, opening menu again
    await anchorButton.click();
    const optionB = optionsList.getByText("option B");
    await expect.element(optionB).toBeInTheDocument();
    await optionB.click();
    expect(handlerB).toBeCalled();
  });
});
