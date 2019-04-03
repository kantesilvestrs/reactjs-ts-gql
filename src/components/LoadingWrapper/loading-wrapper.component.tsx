import React from "react";
import { CircularProgress, Box } from "@material-ui/core";

export interface LoadingWrapperProps {
  children: React.ReactNode;
  loading: boolean;
}

const LoadingWrapper: React.FunctionComponent<LoadingWrapperProps> = ({
  children,
  loading
}) => {
  if (loading) {
    return (
      <Box style={{ width: "100%", padding: "50px", textAlign: "center" }}>
        <CircularProgress data-testid="loadingwrapper-component-loadingspinner" />
      </Box>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default LoadingWrapper;
