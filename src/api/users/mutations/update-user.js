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
    const profile = {
      update: {},
    };

    if (firstName) profile.update.firstName = firstName;
    if (lastName) profile.update.lastName = lastName;
    if (picture) profile.update.picture = picture;
    if (firstName && lastName) {
      profile.update.fullName = `${firstName} ${lastName}`;
    } else if (firstName && !lastName) {
      profile.update.fullName = `${firstName}${ctx.user.profile && ctx.user.profile.lastName ? ` ${ctx.user.profile.lastName}` : ''}`;
    } else if (!firstName && lastName) {
      profile.update.fullName = `${ctx.user.profile && ctx.user.profile.firstName ? `${ctx.user.profile.firstName} ` : ''}${lastName}`;
    }

    query.data.profile = profile;
  }

  return prisma.updateUser(query).$fragment(fragment);
};
