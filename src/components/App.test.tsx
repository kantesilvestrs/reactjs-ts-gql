import React from "react";
import { render, cleanup } from "@testing-library/react";
import App from "./App";

describe("Test: App_component_renders", () => {
  afterEach(cleanup);
  it("1: should render without crashing", () => {
    render(<App />);
  });

  // Test if not found component gets rendered when accessing invalid route
  // Test if contacts component gets rendered
  // Test if going to root it redirects
});
