import EmailValidator from '../services/EmailValidator';
import BcryptService from '../services/BcryptService';
import UserController from '../api/controllers/User';

export function makeUserController(): UserController {
  const emailValidator = new EmailValidator();
  const bcryptService = new BcryptService();
  return new UserController(emailValidator, bcryptService);
}