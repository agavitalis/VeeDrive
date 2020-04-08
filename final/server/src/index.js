require('dotenv').config();
const { ApolloServer } = require('apollo-server');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createStore } = require('./utils');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

const internalEngineDemo = require('./engine-demo');

const jwt = require('jsonwebtoken');
const getUser = token => {
  try {
    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET)
    }
    return false;
  } catch (err) {
    console.log('Error when jwt.verifying token');
    return false;
  }
};

// creates a sequelize connection once. NOT for every request
const store = createStore();

// set up any dataSources our resolvers need
const dataSources = () => ({
  launchAPI: new LaunchAPI(),
  userAPI: new UserAPI({ store }),
});

// the function that sets up the global context for each resolver, using the req
const context = async ({ req }) => {
  // simple auth check on every request
  let response = { user: null };

  const tokenWithBearer = req.headers.authorization || '';
  const token = tokenWithBearer.split(' ')[1];
  // try to retrieve a user with the token
  const tokenUser = getUser(token);
  console.log('tokenUser', tokenUser);
  if (!tokenUser || !tokenUser.email) {
    return response;
  }

  // put in context the user's data used in UserAPI (email and id), so verify they are correct
  const found = await store.users.findOne({ where: { email: tokenUser.email} });
  if (!found) {
    console.log('email not found in users');
    return response;
  }
  if (found.dataValues.id !== tokenUser.id) {
    console.log('id incorrect for email ' + found.email);
    return response;
  }
  console.log('tokenUser ok', tokenUser);
  return { user: tokenUser };
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  engine: {
    apiKey: process.env.ENGINE_API_KEY,
    ...internalEngineDemo,
  },
});

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== 'test')
  server
    .listen({ port: process.env.PORT })
    .then(({ url }) => console.log(`🚀 app running at ${url}`));

// export all the important pieces for integration/e2e tests to use
module.exports = {
  dataSources,
  context,
  typeDefs,
  resolvers,
  ApolloServer,
  LaunchAPI,
  UserAPI,
  store,
  server,
};
