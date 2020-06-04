import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import GraphQLJSON from 'graphql-type-json';
import _ from 'lodash';
import { createServer } from 'http';
import './startup';

import typeDefs from './schema.graphql';

import getUser from './api/users/functions/get-user';

import { prisma } from './generated/prisma-client';

import users from './api/users/resolvers';
import schemas from './api/schemas/resolvers';
import comments from './api/comments/resolvers';

const resolvers = _.merge({
  JSON: GraphQLJSON,
  Query: {
    info: () => 'Welcome to GraphQq',
  },
}, users, schemas, comments);

const port = 3002;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (params) => {
    if (params && params.connection && params.connection.context) return params.connection.context;

    const context = {
      prisma,
    };

    if (!params.req) return context;
    const { headers } = params.req;


    context.user = await getUser(headers.authorization, context);

    return context;
  },
  subscriptions: {
    onConnect: async (connectionParams) => {
      const context = {
        prisma,
      };
      const authToken = connectionParams.authorization || connectionParams.Authorization;
      if (authToken) {
        context.user = await getUser(authToken, context);
      }

      return context;
    },
  },
});

const app = express();

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port }, () => {
  console.log(`Apollo Server on http://localhost:${port}/graphql`);
});
