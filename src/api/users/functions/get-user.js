import { getTokenPayload, getUserInfo } from '../../../integrations/auth0/functions';

const getUser = async (authorization, context) => {
  if (!authorization) return null;
  const token = authorization.replace('Bearer ', '');

  let user;

  if (token) {
    const payload = await getTokenPayload(token);

    if (!payload) return null;
    /* eslint-disable */
    const users = await context.prisma.users({ where: { sub: payload.sub } });
    user = users[0];
    /* eslint-enable */

    if (!user) {
      const userInfo = (await getUserInfo({ token, iss: payload.iss })) || {};
      const {
        email,
        picture,
        given_name: firstName,
        family_name: lastName,
        name: fullName,
        nickname: username,
      } = userInfo;

      user = await context.prisma.createUser({
        sub: payload.sub,
        email,
        profile: {
          create: {
            picture,
            firstName,
            lastName,
            fullName,
          },
        },
        username,
      });
    }
    if (!user.profile) user.profile = await context.prisma.user({ id: user.id }).profile();
  }

  return user;
};

export default getUser;
