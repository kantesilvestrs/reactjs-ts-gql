import React, { useState } from "react";
import gql from "graphql-tag";
import { Typography, Fab, Box, Paper } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ContactListGrid from "../ContactListGrid/contact-list-grid.component";
import { Query } from "react-apollo";
import IContact from "../../gql-client/model/IContact";
import LoadingWrapper from "../../../components/LoadingWrapper/loading-wrapper.component";
import ContactAddDialog from "./../ContactAddDialog/contact-add-dialog.component";
import { ApolloQueryResult } from "apollo-boost";

type FetchContactListType = {
  contacts: IContact[];
};

const FETCH_CONTACT_LIST = gql`
  query {
    contacts {
      id
      name
      email
      __typename @include(if: false)
    }
  }
`;

export interface ContactListProps {}

export interface IContactListState {
  addContactDialogOpen: boolean;
}

const ContactList: React.FunctionComponent<ContactListProps> = () => {
  const [values, setStates] = useState<IContactListState>({
    addContactDialogOpen: false
  });

  function handleAddContactFabClick() {
    setStates({ ...values, addContactDialogOpen: true });
  }

  async function handleAddContactOnClose(
    param: any,
    refetch: () => Promise<ApolloQueryResult<FetchContactListType>>
  ) {
    setStates({ ...values, addContactDialogOpen: false });
    await refetch();
  }

  return (
    <Query<FetchContactListType>
      query={FETCH_CONTACT_LIST}
      notifyOnNetworkStatusChange={true}
      fetchPolicy={"cache-and-network"}
    >
      {({ loading, error, data, refetch }) => {
        return (
          <React.Fragment>
            <Typography variant="h5" align="justify">
              Contact List
              <Fab
                color="secondary"
                size="small"
                style={{ float: "right" }}
                onClick={handleAddContactFabClick}
              >
                <AddIcon />
              </Fab>
            </Typography>
            <Box m={3} />
            <Paper>
              <LoadingWrapper loading={loading}>
                <ContactListGrid
                  contacts={data ? data.contacts : []}
                  onContactChange={refetch}
                />
              </LoadingWrapper>
            </Paper>
            <ContactAddDialog
              open={values.addContactDialogOpen}
              onClose={params => handleAddContactOnClose(params, refetch)}
            />
          </React.Fragment>
        );
      }}
    </Query>
  );
};

export default ContactList;
