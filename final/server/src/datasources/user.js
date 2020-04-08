const { DataSource } = require('apollo-datasource');
const isEmail = require('isemail');
const bcrypt = require('bcrypt');

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  async findOrCreateUser({ email , password } = {}) {
    console.log('user.js findOrCreateUser');
    if (!email || !isEmail.validate(email) || !password) return { success: false, error: 'Invalid email or password' };
    const [ { dataValues: user }, created] = await this.store.users.findOrCreate({where: { email }, defaults: { email, password: await bcrypt.hash(password, 10) }});
    console.log('user', user);
    if (!created) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return {
          success: false,
          message: 'Password is incorrect'
        };
      }
      return {
        success: true,
        message: 'Login successful for ' + user.email,
        user
      };
    }
    return {
      success: true,
      message: 'Signup successful for ' + user.email,
      user
    };
  }

  async me() {
    console.log('datasources/user.js me', this.context.user);
    return this.context.user;
  }

  async bookTrips({ launchIds }) {
    const userId = this.context.user.id;
    if (!userId) return;

    let results = [];

    // for each launch id, try to book the trip and add it to the results array if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ launchId }) {
    const userId = this.context.user.id;
    const res = await this.store.trips.findOrCreate({
      where: { userId, launchId },
    });
    return res && res.length ? res[0].get() : false;
  }

  async cancelTrip({ launchId }) {
    const userId = this.context.user.id;
    return !!this.store.trips.destroy({ where: { userId, launchId } });
  }

  async getLaunchIdsByUser() {
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId },
    });
    return found && found.length
      ? found.map(l => l.dataValues.launchId).filter(l => !!l)
      : [];
  }

  async isBookedOnLaunch({ launchId }) {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId, launchId },
    });
    return found && found.length > 0;
  }
}

module.exports = UserAPI;
