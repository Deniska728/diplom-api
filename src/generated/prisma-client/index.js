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
    name: "Comment",
    embedded: false
  },
  {
    name: "CommentContent",
    embedded: false
  },
  {
    name: "GqlSchema",
    embedded: false
  },
  {
    name: "GqlIntrospectionSchema",
    embedded: false
  },
  {
    name: "GqlType",
    embedded: false
  },
  {
    name: "GqlBaseType",
    embedded: false
  },
  {
    name: "GqlField",
    embedded: false
  },
  {
    name: "GqlInputValue",
    embedded: false
  },
  {
    name: "GqlEnumValue",
    embedded: false
  },
  {
    name: "GqlDirective",
    embedded: false
  },
  {
    name: "GqlTypeKind",
    embedded: false
  },
  {
    name: "GqlDirectiveLocation",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://diplom-78da81bb01.herokuapp.com/diplom-api/dev`
});
exports.prisma = new exports.Prisma();
