import { AuthenticationError } from 'apollo-server-express';

const fragment = `
  fragment UserWithPosts on User {
    id
    email
    username
    profile {
      firstName
      lastName
      fullName
    }
  }
`;

export default async (parent, {
  username, email, firstName, lastName, picture,
}, { prisma, ...ctx }) => {
  if (!ctx.user) throw new AuthenticationError('Access denied');

  const query = {
    where: { id: ctx.user.id },
    data: {},
  };

  if (username) query.data.username = username;
  if (email) query.data.email = email;

  if (firstName || lastName || picture) {
    const doesHaveProfile = ctx.user.profile ? 'update' : 'create';
    const profile = {
      [doesHaveProfile]: {},
    };

    profile[doesHaveProfile].firstName = firstName || '';
    profile[doesHaveProfile].lastName = lastName || '';
    profile[doesHaveProfile].picture = picture || '';

    if (firstName && lastName) {
      profile[doesHaveProfile].fullName = `${firstName} ${lastName}`;
    } else if (firstName && !lastName) {
      profile[doesHaveProfile].fullName = `${firstName}${ctx.user.profile && ctx.user.profile.lastName ? ` ${ctx.user.profile.lastName}` : ''}`;
    } else if (!firstName && lastName) {
      profile[doesHaveProfile].fullName = `${ctx.user.profile && ctx.user.profile.firstName ? `${ctx.user.profile.firstName} ` : ''}${lastName}`;
    }

    query.data.profile = profile;
  }

  return prisma.updateUser(query).$fragment(fragment);
};
