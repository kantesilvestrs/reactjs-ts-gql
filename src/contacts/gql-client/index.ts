// Using apollo boost for easier configuration
import ApolloClient from "apollo-boost";

// Initialize contact apollo client
const contactClient = new ApolloClient({
  uri: "/" // Local proxy to 3001
});

// Disable caching to see data updates, this ideally should be applied per query, or vice versa
contactClient.defaultOptions.query = {
  fetchPolicy: "no-cache"
};

export default contactClient;
