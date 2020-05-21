"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "UserProfile",
    embedded: false
  },
  {
    name: "GqlSchema",
    embedded: false
  },
  {
    name: "GqlSchemaVersion",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://diplom-78da81bb01.herokuapp.com/diplom-api/dev`
});
exports.prisma = new exports.Prisma();
