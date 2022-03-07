import EmailValidator from '../../services/EmailValidator';
import BcryptService from '../../services/BcryptService';
import UserController from '../../api/controllers/User';
import UserRepository from '../../repositories/users/UserRepository';

export default function makeUserController(): UserController {
  const emailValidator = new EmailValidator();
  const bcryptService = new BcryptService();
  const repository = new UserRepository(bcryptService);
  return new UserController(emailValidator, repository);
}
