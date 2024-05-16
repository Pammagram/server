import gql from 'graphql-tag';

export const createMessageAddedSubscription = () => gql`
  subscription MessageAdded {
    messageAdded {
      data {
        id
      }
    }
  }
`;
