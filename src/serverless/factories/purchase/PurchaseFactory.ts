import PurchaseController from '../../api/controllers/PurchaseController';
import PurchaseDAOImp from '../../DAOImp/purchase/PurchaseDAOImp';

const makePurchase = (): PurchaseController => {
  const purchaseDAO = new PurchaseDAOImp();
  const savePurchases = new PurchaseController(purchaseDAO);
  return savePurchases;
};

export default makePurchase;
