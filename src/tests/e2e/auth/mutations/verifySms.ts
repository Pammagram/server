import gql from 'graphql-tag';

export const createVerifySmsMutation = (verificationCode: string) => gql`
mutation VerifySms {
  verifySms(input: { phoneNumber: "1234", code: "${verificationCode}", device: "test" }) {
    data {
      id
    }
  }
}
`;
