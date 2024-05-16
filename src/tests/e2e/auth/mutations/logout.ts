import gql from 'graphql-tag';

export const createLogoutMutation = () => gql`
  mutation Logout {
    logout {
      data
    }
  }
`;
