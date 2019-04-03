import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { cleanup, render } from "@testing-library/react";
import Layout from "./layout.component";

describe("Test: Layout_component_render", () => {
  const appBarTitle = "layout-component-appbar-title";
  const menuBarItem = "layout-component-drawer-menulist-contactlistItem";
  const childItemTestId = "layout-component-child-component";
  const renderWithRoute = (path?: string) =>
    render(
      <MemoryRouter initialEntries={[`${path}`]}>
        <Layout>
          <Route exact path="/">
            <div data-testid={childItemTestId} />
          </Route>
          <Route exact path="/contacts/list" />
        </Layout>
      </MemoryRouter>
    );

  afterEach(cleanup);

  it("1: should render without crashing", () => {
    renderWithRoute();
  });

  it("2: should render appbar title", () => {
    const { getByTestId } = renderWithRoute();

    expect(() => getByTestId(appBarTitle)).toBeDefined();
    expect(getByTestId(appBarTitle).innerHTML).toBe("DrugDev/fronend-test");
  });

  it("3: should render contact list menu item and contain text 'Contact List'", () => {
    const { getByTestId } = renderWithRoute();

    expect(() => getByTestId(menuBarItem)).toBeDefined();
    expect(getByTestId(menuBarItem).innerHTML).toContain("Contact List");
  });

  it("4: should render an unselected contact list menu item on root route", () => {
    const { getByTestId } = renderWithRoute(`/`);

    expect(() => getByTestId(menuBarItem)).toBeDefined();
    expect(getByTestId(menuBarItem).className).not.toContain("Mui-selected");
  });

  it("5: should render a selected contact list menu item on '/contact/list' route", () => {
    const { getByTestId } = renderWithRoute(`/contacts/list`);

    expect(() => getByTestId(menuBarItem)).toBeDefined();
    expect(getByTestId(menuBarItem).className).toContain("Mui-selected");
  });
});
