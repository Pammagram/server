import gql from 'graphql-tag';

export const createSendSmsMutation = () => gql`
  mutation SendSms {
    sendSms(input: { phoneNumber: "1234" }) {
      data
    }
  }
`;
