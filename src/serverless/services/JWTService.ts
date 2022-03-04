import jwt, { Secret } from 'jsonwebtoken';
import WebTokenAdapter from '../adapters/services/WebTokenAdapter';
import UserModel from '../data/models/UserModel';

export default class JWTService implements WebTokenAdapter {
  sign(payload: Omit<UserModel, 'password'>, expiresIn: string | number): string {
    return jwt.sign(payload, `${process.env.JWT_SECRET}` as string, {
      expiresIn: expiresIn,
    });
  }
  
  verify(token: string): Omit<UserModel, 'password'> {
    const { id, email, name } = jwt.verify(token, `${process.env.JWT_SECRET}` as string) as Omit<UserModel, 'password'>;
    return {
      id,
      email,
      name,
    };
  }
}