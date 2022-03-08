import EmailValidator from '../../services/EmailValidator';
import BcryptService from '../../services/BcryptService';
import UserController from '../../api/controllers/User';
import UserDAOImp from '../../repositories/users/UserDAOImp';

export default function makeUserController(): UserController {
  const emailValidator = new EmailValidator();
  const bcryptService = new BcryptService();
  const userDAO = new UserDAOImp(bcryptService);
  return new UserController(emailValidator, userDAO);
}
