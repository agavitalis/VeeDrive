const { RESTDataSource } = require('apollo-datasource-rest');

class LaunchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v3/';
  }

  // leaving this inside the class to make the class easier to test
  launchReducer(launch) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      date: launch.launch_date_unix,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch,
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type,
      },
    };
  }

  async getAllLaunches() {
    const response = await this.get('launches');

    const flightsAdded = [];
    let result = [];
    if (Array.isArray(response)) {
      result = response.reduce((accum, launch) => {
        //console.log('launch', launch);
        if (!flightsAdded.includes(launch.flight_number)) {   // some flights happen to be duplicated, get ride of them
          //console.log(launch.id + ' added to accum');
          accum.push(this.launchReducer(launch));
          flightsAdded.push(launch.flight_number);
        }
        return accum;
      }, [])
    }
    //console.log('result', result);
    return result;
  }

  async getLaunchById({ launchId }) {
    const res = await this.get('launches', { flight_number: launchId });
    return this.launchReducer(res[0]);
  }

  async getLaunchesByIds({ launchIds }) {
    return Promise.all(
      launchIds.map(launchId => this.getLaunchById({ launchId })),
    );
  }
}

module.exports = LaunchAPI;
