import EmailValidator from '../../services/EmailValidator';
import BcryptService from '../../services/BcryptService';
import JWTService from '../../services/JWTService';
import TokenController from '../../api/controllers/TokenController';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';

export default function makeTokenController(): TokenController {
  const emailValidator = new EmailValidator();
  const bcryptService = new BcryptService();
  const userDAO = new UserDAOImp(bcryptService);
  const webTokenService = new JWTService();
  return new TokenController(emailValidator, userDAO, webTokenService, bcryptService);
}
