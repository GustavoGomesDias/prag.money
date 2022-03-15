import SavePurchaseController from '../../api/controllers/SavePurchaseController';
import PaymentDAOImp from '../../DAOImp/payment/PaymentDAOImp';
import PayWithDAOImp from '../../DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../DAOImp/purchase/PurchaseDAOImp';
import { makeUserDAO } from '../users/UserFacotory';

const makePurchase = (): SavePurchaseController => {
  const paymentDAO = new PaymentDAOImp();
  const purchaseDAO = new PurchaseDAOImp();
  const payWithDAO = new PayWithDAOImp();
  const userDAO = makeUserDAO();
  const savePurchases = new SavePurchaseController(paymentDAO, purchaseDAO, payWithDAO, userDAO);
  return savePurchases;
};

export default makePurchase;
