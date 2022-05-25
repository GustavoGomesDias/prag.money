/* eslint-disable semi */
import { NextApiRequest } from 'next';
import UserModel from '../models/UserModel';

export default interface NextApiUserRequest extends NextApiRequest {
  user: UserModel
}
