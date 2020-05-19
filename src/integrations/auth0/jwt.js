import jwksRSA from 'jwks-rsa';

export const jwtOptions = {
  aud: process.env.AUTH0_AUD,
  issuer: process.env.AUTH0_ISSUER,
  algorithm: ['RS256'],
};

export const jwksClient = jwksRSA({
  cache: true,
  rateLimit: true,
  jwksUri: process.env.AUTH0_JWKS_URI,
});
// eslint-disable-next-line
export const getSigningKey = kid => new Promise((resolve, reject) => jwksClient.getSigningKey(kid, (err, key) => {
  if (err) {
    reject(err);
    return;
  }
  resolve(key);
}));
