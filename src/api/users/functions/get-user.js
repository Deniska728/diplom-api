import jwt from 'jsonwebtoken';

const { APP_SECRET } = process.env;

const getUser = async (authorization, context) => {
  if (!authorization) return null;
  const token = authorization.replace('Bearer ', '');

  if (token) {
    let userId = null;

    try {
      const user = jwt.verify(token, APP_SECRET);
      userId = user.userId;
    } catch (e) {
      console.log(e.message);
    }

    if (!userId) return null;

    const user = await context.prisma.user({ id: userId });
    if (!user.profile) user.profile = await context.prisma.user({ id: user.id }).profile();

    return user;
  }

  return null;
};

export default getUser;
