import _ from 'lodash';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import GraphQLJSON from 'graphql-type-json';

import './startup';

import typeDefs from './schema.graphql';

import { getUser } from './utils';

import { prisma } from './generated/prisma-client';

import users from './api/users/resolvers';
import auth from './api/auth/resolvers';
import posts from './api/posts/resolvers';

const resolvers = _.merge({
  JSON: GraphQLJSON,
  Query: {
    test: () => 'Welcome to GraphQq',
  },
}, users, auth, posts);

console.log(resolvers, typeDefs)

const port = 3000;

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
