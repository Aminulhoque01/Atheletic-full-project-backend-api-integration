import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (payload: object, secret: Secret, expireTime: string) => {
  return jwt.sign(payload, secret, { expiresIn: expireTime });
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelper = { createToken, verifyToken };


// import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

// const creteToken = (
//   payload: Record<string, unknown>,
//   secret: Secret,
//   expireTime: string
// ): string => {
//   return jwt.sign(payload, secret, {
//     expiresIn: expireTime,
//   });
// };

// const verifyToken = (token: string, secret: Secret): JwtPayload => {
//   return jwt.verify(token, secret) as JwtPayload;
// };

// export const jwtHelpers = {
//   creteToken,
//   verifyToken,
// };
