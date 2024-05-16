import gql from 'graphql-tag';

export const createAddMessageMutation = () => gql`
  mutation addMessage($input: AddMessageInput!) {
    addMessage(input: $input) {
      data {
        id
      }
    }
  }
`;
