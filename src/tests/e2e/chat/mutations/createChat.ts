import gql from 'graphql-tag';

export const createCreateChatMutation = () => gql`
  mutation CreateChat($input: CreateChatInput!) {
    createChat(input: $input) {
      data {
        id
      }
    }
  }
`;
