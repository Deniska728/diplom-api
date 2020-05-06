import { ApolloServer } from 'apollo-server-express';
import express from 'express';

import './startup';

import typeDefs from './schema.graphql';

import { getUser } from './utils';

const { prisma } = require('./generated/prisma-client');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const { headers } = req;

    const context = {
      prisma,
    };

    context.user = await getUser(headers.authorization, context);

    return context;
  },
});

const app = express();

server.applyMiddleware({ app, path: process.env.GRAPHQL_ENDPOINT || '/api' });
app.get('/schema', (req, res) => {
  res.json(JSON.stringify({ schema: typeDefs }));
  res.status(200);
  res.end();
});

app.listen({ port: 3000 }, () => {
  console.log(`🚀 Server ready at http://localhost:${3000}${server.graphqlPath}`);
});
