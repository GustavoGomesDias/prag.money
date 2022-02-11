import EmailValidator from '../../services/EmailValidator';
import BcryptService from '../../services/BcryptService';
import UserController from '../../api/controllers/User';
import UserRepository from '../../repositories/users/UserRepository';
import JWTService from '../../services/JWTService';

export function makeUserController(): UserController {
  const emailValidator = new EmailValidator();
  const bcryptService = new BcryptService();
  const repository = new UserRepository(bcryptService)
  const jwtService = new JWTService();
  return new UserController(emailValidator, repository, jwtService, bcryptService);
}