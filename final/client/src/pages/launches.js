import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { LaunchTile, Header, Button, Loading } from '../components';
import {LAUNCH_TILE_DATA} from "../pages/profile";

export const GET_LAUNCHES = gql`
  query GetLaunchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

export default function Launches() {
  const { data, loading, error, fetchMore } = useQuery(GET_LAUNCHES);
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <>
      <Header />
      {
        loading?
          <Loading />
        : data.launches && data.launches.launches?
        data.launches.launches.map(launch => (
          <LaunchTile key={launch.id} launch={launch} />
          ))
        :
          null
      }

      {!loading && data.launches && data.launches.hasMore && (
          <Button
            onClick={() =>
              fetchMore({
                variables: {
                  after: data.launches.cursor,
                },
                updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    ...fetchMoreResult,
                    launches: {
                      ...fetchMoreResult.launches,
                      launches: [
                        ...prev.launches.launches,
                        ...fetchMoreResult.launches.launches,
                      ],
                    },
                  };
                },
              })
            }
          >
            Load More
          </Button>
        )}

    </>
  );
}
