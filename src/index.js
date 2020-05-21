import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import GraphQLJSON from 'graphql-type-json';
import _ from 'lodash';

import './startup';

import typeDefs from './schema.graphql';

import getUser from './api/users/functions/get-user';

import { prisma } from './generated/prisma-client';

import users from './api/users/resolvers';

const resolvers = _.merge({
  JSON: GraphQLJSON,
  Query: {
    info: () => 'Welcome to GraphQq',
  },
}, users);

const port = 3002;

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

app.listen({ port }, () => {
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
});
