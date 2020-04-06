import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LoginForm } from '../components';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      token
      email
    }
  }
`;

export default function Login() {
  const client = useApolloClient();
  const [login, { error }] = useMutation(
    LOGIN_USER,
    {
      onCompleted({ login }) {
        if (login.success) {
          localStorage.setItem('token', login.token);
        client.writeData({ data: { isLoggedIn: true } });
        } else {
          toast.error(login.message, {
            position: toast.POSITION.BOTTOM_CENTER
          });
        }
      }
    }
  );

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return <>
    <LoginForm login={login} />
    <ToastContainer autoClose={3000} />
  </>
}
