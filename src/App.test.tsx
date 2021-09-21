import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import App from "src/App";

test("renders learn react link", () => {
  render(<App />);

  let imageList = document.querySelector("[data-testid=image-list]");
  expect(imageList).toBeInTheDocument();

  let settingsMenu = document.querySelector("[data-testid=settings-menu]");
  expect(settingsMenu).not.toBeInTheDocument();

  let settingsButton = document.querySelector("[data-testid=settings-button]");

  act(() => {
    settingsButton!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  settingsMenu = document.querySelector("[data-testid=settings-menu]");
  expect(settingsMenu).toBeInTheDocument();
});
