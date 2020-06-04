import Query from './queries';
import Mutation from './mutations';
import Subscription from './subscriptions';
import types from './types';

export default {
  Query,
  Mutation,
  Subscription,
  ...types,
};
