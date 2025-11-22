import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import CardModal from "./cardModal";
import { page, userEvent } from "vitest/browser";

function renderNewCardModal() {
  return render(
    <CardModal modalState={{ type: "new" }} setModalState={() => {}} />
  );
}

describe("CardModal", () => {
  it("shouldn't render on state 'null'", async () => {
    render(<CardModal modalState={null} setModalState={() => {}} />);

    const modal = page.getByRole("dialog");
    await expect.element(modal).not.toBeInTheDocument();
  });

  it("should render on valid modal state", async () => {
    renderNewCardModal();

    const modal = page.getByRole("dialog");
    await expect.element(modal).toBeInTheDocument();
  });

  it("should close on 'cancel' button click", async () => {
    renderNewCardModal();

    const cancelButton = page.getByRole("button").getByText("cancel");
    await cancelButton.click();

    const modal = page.getByRole("dialog");
    await expect.element(modal).not.toBeInTheDocument();
  });

  it("should close on 'escape' key pressed", async () => {
    renderNewCardModal();

    await userEvent.keyboard("{Escape}")

    const modal = page.getByRole("dialog");
    await expect.element(modal).not.toBeInTheDocument();
  });
});
