import EmailValidator from '../../services/EmailValidator';
import BcryptService from '../../services/BcryptService';
import UserController from '../../api/controllers/User';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';
import FinancialHelper from '../../services/FinancialHelper';

export function makeUserDAO(): UserDAOImp {
  const bcryptService = new BcryptService();
  const financialHelper = new FinancialHelper();
  const userDAO = new UserDAOImp(bcryptService, financialHelper);
  return userDAO;
}

export default function makeUserController(): UserController {
  const emailValidator = new EmailValidator();
  const userDAO = makeUserDAO();
  return new UserController(emailValidator, userDAO);
}
