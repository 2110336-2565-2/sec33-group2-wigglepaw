import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Header from "./Header";

describe("Header", () => {
  it.each(["About", "Login", "Register"])(
    "should render the %s link",
    (text) => {
      const screen = render(<Header />);

      const link = screen.getByText(new RegExp(text, "i"));
      expect(link).toBeVisible();
      expect(link).toHaveAttribute("href", `/${text.toLowerCase()}`);
    }
  );

  it("should have WigglePaw heading", () => {
    const screen = render(<Header />);

    expect(screen.getByText("WigglePaw")).toBeVisible();
  });
});
