import React from "react";

export interface IContactViewRouteMatchParams {
  contactId: string;
}

export interface IContactViewProps {
  contactId: string;
}

const ContactView: React.FunctionComponent<IContactViewProps> = ({
  contactId
}) => {
  return <React.Fragment />;
};

export default ContactView;
