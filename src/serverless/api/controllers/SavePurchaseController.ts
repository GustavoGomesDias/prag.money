/* eslint-disable camelcase */
import { validationField } from '../../../utils/validations';
import PaymentDAOImp from '../../DAOImp/payment/PaymentDAOImp';
import PayWithDAOImp from '../../DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../DAOImp/purchase/PurchaseDAOImp';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';
import PurchaseModel from '../../data/models/Purchase';
import AddPurchase from '../../data/usecases/AddPurchase';
import { badRequest, HttpResponse, notFound } from '../helpers/http';

export default class SavePurchaseController {
  private readonly paymentDAO: PaymentDAOImp;

  private readonly purchaseDAO: PurchaseDAOImp;

  private readonly payWithDAO: PayWithDAOImp;

  private readonly userDAO: UserDAOImp;

  constructor(paymentDAO: PaymentDAOImp, purchaseDAO: PurchaseDAOImp, payWithDAO: PayWithDAOImp, user: UserDAOImp) {
    this.paymentDAO = paymentDAO;
    this.purchaseDAO = purchaseDAO;
    this.payWithDAO = payWithDAO;
    this.userDAO = user;
  }

  async handleAddPurchase(infos: AddPurchase): Promise<HttpResponse> {
    const {
      description, purchase_date, value, user_id, paymentId,
    } = infos;

    if (validationField(description) || validationField(purchase_date)) {
      return badRequest('Descrição ou data de compra inválidas.');
    }

    if (value < 0) {
      return badRequest('Valor não pode ser menor que zero');
    }

    if (!this.userDAO.checkIfUserExists(user_id)) {
      return notFound('Usuário não existe');
    }
  }
}
