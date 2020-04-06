import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Loading, Header, LaunchTile } from '../components';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    date
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

export const GET_MY_TRIPS = gql`
  query GetMyTrips {
    me {
      id
      email
      trips {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

export default function Profile() {
  const { data, loading, error } = useQuery(
    GET_MY_TRIPS,
    { fetchPolicy: "network-only" }
  );
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  const me = data.me;
  return (
    <>
      <Header>My Trips</Header>

      {
        loading?
          <Loading />
        : me && me.trips.length?
          ( me.trips.map(launch => (
          <LaunchTile key={launch.id} launch={launch} />
          )) )
        :
        <p>You haven't booked any trips</p>
      }
    </>
  );
}
