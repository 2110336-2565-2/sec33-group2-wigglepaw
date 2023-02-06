import { render } from "@testing-library/react";
import { vi } from "vitest";
import Header from "./Header";

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
}));

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

    expect(screen.getByRole("heading", { name: "WigglePaw" })).toBeVisible();
  });

  it("should have WigglePaw image", () => {
    const screen = render(<Header />);

    const image = screen
      .getByRole("link", { name: "WigglePaw" })
      .querySelector("img");
    expect(image).toBeVisible();
    expect(image?.src).toContain("logo_w.png");
  });
});
