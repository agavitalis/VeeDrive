import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Button from '../components/button';

export const BOOK_TRIPS = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

export default function BookTrips({ cartItems }) {
  const [bookTrips, { loading, data }] = useMutation(
    BOOK_TRIPS,
    {
      variables: { launchIds: cartItems },
      update(cache) {
        cache.writeData({ data: { cartItems: [] } });
      }
    }
  );

  return (
    loading?
      <Button>Booking</Button>
    : data && data.bookTrips && !data.bookTrips.success?
      <p data-testid="message">{data.bookTrips.message}</p>
    :
      <Button onClick={bookTrips} data-testid="book-button">Book All</Button>
  )

}
