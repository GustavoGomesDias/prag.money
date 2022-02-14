import EmailValidator from '../../services/EmailValidator';
import BcryptService from '../../services/BcryptService';
import UserRepository from '../../repositories/users/UserRepository';
import JWTService from '../../services/JWTService';
import TokenController from '../../api/controllers/TokenController';

export function makeTokenController(): TokenController {
  const emailValidator = new EmailValidator();
  const bcryptService = new BcryptService();
  const repository = new UserRepository(bcryptService)
  const webTokenService = new JWTService();
  return new TokenController(emailValidator, repository, webTokenService, bcryptService);
}