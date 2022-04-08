import AcquisitionController from '../../api/controllers/AcquisitionController';
import PaymentDAOImp from '../../DAOImp/payment/PaymentDAOImp';
import PayWithDAOImp from '../../DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../DAOImp/purchase/PurchaseDAOImp';
import { makeUserDAO } from '../users/UserFacotory';

const makeAcquisition = (): AcquisitionController => {
  const paymentDAO = new PaymentDAOImp();
  const purchaseDAO = new PurchaseDAOImp();
  const payWithDAO = new PayWithDAOImp();
  const userDAO = makeUserDAO();
  const savePurchases = new AcquisitionController(paymentDAO, purchaseDAO, payWithDAO, userDAO);
  return savePurchases;
};

export default makeAcquisition;
