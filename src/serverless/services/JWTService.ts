import jwt from 'jsonwebtoken';
import WebTokenAdapter from '../adapters/services/WebTokenAdapter';
import UserModel from '../data/models/UserModel';
import { TokenExpired } from '../error/PMoneyErrors';

export default class JWTService implements WebTokenAdapter {
  sign(payload: Omit<UserModel, 'password'>, expiresIn: string | number): string {
    return jwt.sign(payload, `${process.env.JWT_SECRET}` as string, {
      expiresIn,
    });
  }

  verify(token: string): Omit<UserModel, 'password'> {
    const payload = jwt.verify(token, `${process.env.JWT_SECRET}` as string, (err, decoded) => {
      if (err) {
        throw new TokenExpired();
      }

      return decoded as Omit<UserModel, 'password'>;
    }) as unknown as Omit<UserModel, 'password'>;

    const { id, email, name } = payload;
    return {
      id,
      email,
      name,
    };
  }
}
