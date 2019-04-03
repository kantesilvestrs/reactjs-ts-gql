import React from "react";
import { Switch, RouteComponentProps } from "react-router-dom";
import { Route } from "react-router-dom";
import useRouter from "use-react-router";
import ContactList from "./components/ContactList/contact-list.component";
import ContactView from "./components/ContactView/contact-view.component";
import { IContactViewRouteMatchParams } from "./components/ContactView/contact-view.component";
import { ApolloProvider } from "react-apollo";
import contactClient from "./gql-client";

const Contacts: React.FunctionComponent = () => {
  const router = useRouter();

  return (
    <ApolloProvider client={contactClient}>
      <Switch>
        <Route
          exact
          path={`${router.match.url}/list`}
          component={ContactList}
          data-testid="contacts-module-contactlist-component"
        />
        <Route
          path={`${router.match.url}/view/:contactId`}
          render={(
            routerProps: RouteComponentProps<IContactViewRouteMatchParams>
          ) => (
            <ContactView
              contactId={routerProps.match.params.contactId}
              data-testid="contacts-module-contactview-component"
            />
          )}
        />
      </Switch>
    </ApolloProvider>
  );
};

export default Contacts;
