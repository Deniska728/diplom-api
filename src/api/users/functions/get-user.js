import jwt from 'jsonwebtoken';

const { APP_SECRET } = process.env;

const getUser = async (authorization, context) => {
  if (!authorization) return null;
  const token = authorization.replace('Bearer ', '');

  if (token) {
    const { userId, ...props } = jwt.verify(token, APP_SECRET);

    console.log(props);

    const user = await context.prisma.user({ id: userId });
    if (!user.profile) user.profile = await context.prisma.user({ id: user.id }).profile();

    return user;
  }

  return null;
};

export default getUser;
