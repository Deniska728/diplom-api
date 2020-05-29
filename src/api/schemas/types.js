export default {
  Schema: {
    members: ({ id }, _, { prisma }) => prisma.gqlSchema({ id }).members(),
    introspectionSchema: ({ id }, _, { prisma }) => prisma.gqlSchema({ id }).introspectionSchema(),
    owner: ({ id }, _, { prisma }) => prisma.gqlSchema({ id }).owner(),
  },
  GqlIntrospectionSchema: {
    types: ({ id }, _, { prisma }) => prisma.gqlIntrospectionSchema({ id }).types(),
    directives: ({ id }, _, { prisma }) => prisma.gqlIntrospectionSchema({ id }).directives(),
  },
  GqlType: {
    id: ({ id }, _, { prisma }) => prisma.gqlType({ id }).id(),
    fields: ({ id }, _, { prisma }) => prisma.gqlType({ id }).fields(),
    interfaces: ({ id }, _, { prisma }) => prisma.gqlType({ id }).interfaces(),
    possibleTypes: ({ id }, _, { prisma }) => prisma.gqlType({ id }).possibleTypes(),
    enumValues: ({ id }, _, { prisma }) => prisma.gqlType({ id }).enumValues(),
    inputFields: ({ id }, _, { prisma }) => prisma.gqlType({ id }).inputFields(),
  },
  GqlDirective: {
    args: ({ id }, _, { prisma }) => prisma.gqlDirective({ id }).args(),
  },
  GqlField: {
    kinds: ({ id }, _, { prisma }) => prisma.gqlField({ id }).kinds(),
    args: ({ id }, _, { prisma }) => prisma.gqlField({ id }).args(),
  },
  GqlInputValue: {
    kinds: ({ id }, _, { prisma }) => prisma.gqlInputValue({ id }).kinds(),
  },
};
