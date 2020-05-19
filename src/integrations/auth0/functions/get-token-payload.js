import jwt from 'jsonwebtoken';

import { jwtOptions, getSigningKey } from '../jwt';

const getTokenPayload = async (token) => {
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || (decoded && !decoded.header)) return null;

  let payload;

  try {
    const key = await getSigningKey(decoded.header.kid);
    const signingKey = key.publicKey || key.rsaPublicKey;
    payload = jwt.verify(token, signingKey, jwtOptions);
  } catch (err) {
    console.log(err);
  }

  return payload;
};

export default getTokenPayload;
