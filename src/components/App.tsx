import React from "react";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";

// Internal component usings
import Layout from "./Layout/layout.component";
import Contacts from "../contacts/contacts.module.component";
import NotFound from "./NotFound/not-found.component";

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Redirect exact from="/" to="/contacts/list" />
          <Route
            path="/contacts"
            component={Contacts}
            data-testid="app-component-contacts-module"
          />
          <Route
            component={NotFound}
            data-testid="app-component-notfound-component"
          />
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
