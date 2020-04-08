import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { GET_LAUNCH_DETAILS } from '../pages/launch';
import Button from '../components/button';

// export all queries used in this file for testing
export { GET_LAUNCH_DETAILS };

export const TOGGLE_CART = gql`
  mutation addOrRemoveFromCart($launchId: ID!) {
    addOrRemoveFromCart(id: $launchId) @client
  }
`;

export const CANCEL_TRIP = gql`
  mutation cancel($launchId: ID!) {
    cancelTrip(launchId: $launchId) {
      success
      message
      launches {
        id
        isBooked
        isInCart @client
      }
    }
  }
`;

const GET_IS_IN_CART = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      id
      isInCart @client
    }
  }
`;

export default function ActionButton({ isBooked, id, isInCart }) {
  const [mutate, { loading, error }] = useMutation(
    isBooked ? CANCEL_TRIP : TOGGLE_CART,
    {
      variables: { launchId: id },
      refetchQueries: [   // Update isInCart as it is in local cache (@client), it doesn't come from server
        {
          query: GET_IS_IN_CART,
          variables: { launchId: id },
        },
      ]
    }
  );

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <div>
      <Button
        onClick={mutate}
        isBooked={isBooked}
        data-testid={'action-button'}
      >
        {
          loading?  /* It only shows when Cancel This Trip is clicked */
            'Canceling'
          : isBooked?
            'Cancel This Trip'
          : !isInCart?
              'Add to Cart'
          :
              'Remove from Cart'
        }
      </Button>
    </div>
  );
}
