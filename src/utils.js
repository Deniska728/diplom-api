import jwt from 'jsonwebtoken';

const APP_SECRET = 'GraphQL-is-aw3some';

function getUser(headers, context) {
  const Authorization = headers;

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET);

    return context.prisma.user({ id: userId });
  }

  return null;
}

module.exports = {
  APP_SECRET,
  getUser,
};
