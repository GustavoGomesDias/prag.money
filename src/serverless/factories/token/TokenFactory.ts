import BcryptService from '../../services/BcryptService';
import JWTService from '../../services/JWTService';
import TokenController from '../../api/controllers/TokenController';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';
import PaymentDAOImp from '../../DAOImp/payment/PaymentDAOImp';

export default function makeTokenController(): TokenController {
  const paymentDAOImp = new PaymentDAOImp();
  const bcryptService = new BcryptService();
  const userDAO = new UserDAOImp(bcryptService);
  const webTokenService = new JWTService();
  return new TokenController(userDAO, webTokenService, bcryptService, paymentDAOImp);
}
