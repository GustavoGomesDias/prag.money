/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import { validationField } from '../../../utils/validations';
import PaymentDAOImp from '../../DAOImp/payment/PaymentDAOImp';
import PayWithDAOImp from '../../DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../DAOImp/purchase/PurchaseDAOImp';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';
import PurchaseModel from '../../data/models/PurchaseModel';
import AddPurchase from '../../data/usecases/AddPurchase';
import {
  badRequest, created, HttpResponse, notFound, ok, serverError,
} from '../helpers/http';

export default class AcquisitionController {
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

  async handleGetAcquisitionsByPaymentId(paymentId: number): Promise<HttpResponse> {
    try {
      if (Number.isNaN(paymentId) || paymentId < 0) {
        return badRequest('ID inválido.');
      }

      return ok('Ok!');
    } catch (err) {
      console.log(err);
      return serverError('Erro no servidor, tente novamente mais tarde.');
    }
  }

  async handleAddPurchase(infos: AddPurchase): Promise<HttpResponse> {
    try {
      const {
        description, purchase_date, value, user_id, payments,
      } = infos;

      if (validationField(description)) {
        return badRequest('Descrição de compra inválidas.');
      }

      if (value < 0) {
        return badRequest('Valor da compra inválido.');
      }

      if (!(await this.userDAO.checkIfUserExists(user_id))) {
        return notFound('Usuário não existe.');
      }

      // eslint-disable-next-line consistent-return
      for (const payment of payments) {
        const ifExists = await this.paymentDAO.checkIfPaymentExists(payment.paymentId);

        if (!ifExists) {
          return notFound('Forma de pagamento não existe.');
        }
      }

      const result = await this.purchaseDAO.add({
        description,
        purchase_date: new Date(purchase_date),
        user_id,
        value,
      }) as PurchaseModel;

      payments.forEach(async (payment) => {
        await this.payWithDAO.add({
          payment_id: payment.paymentId,
          purchase_id: result.id as number,
          value: payment.value,
        });
      });

      return created('Compra cadastrada com sucesso!');
    } catch (err) {
      console.log(err);
      return serverError('Erro no servidor, tente novamente mais tarde.');
    }
  }
}
