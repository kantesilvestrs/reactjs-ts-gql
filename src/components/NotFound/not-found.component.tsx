import React from "react";
import { Paper, Typography } from "@material-ui/core";

const NotFound: React.FunctionComponent = () => {
  return (
    <Paper style={{ padding: "30px" }}>
      <Typography variant="h4">Page Not Found</Typography>
    </Paper>
  );
};

export default NotFound;
