/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import {
  checkIfExists404code,
  checkIsEquals,
  validationExpenseValue, validationField400code, validationId,
} from '../helpers/Validations';
import PaymentDAOImp from '../../DAOImp/payment/PaymentDAOImp';
import PayWithDAOImp from '../../DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../DAOImp/purchase/PurchaseDAOImp';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';
import PurchaseModel from '../../data/models/PurchaseModel';
import AddPurchase, { AddPayment } from '../../data/usecases/AddPurchase';
import handleErrors from '../../error/helpers/handleErrors';
import {
  created, okWithContent, HttpResponse, ok,
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

  async handleDeleteAcquisitionsByPaymentId(paymentId: number): Promise<HttpResponse> {
    try {
      validationId(paymentId);
      await this.paymentDAO.checkIfPaymentExists(paymentId);

      const { acquisitions } = await this.paymentDAO.findByPaymentId(paymentId);
      checkIfExists404code(acquisitions, 'Não existe compras/gastos pagas com essa forma de pagamento.');
      await this.purchaseDAO.deletePurchasesByAcquisisitionList(acquisitions);

      return ok('Gastos/Compras deletas com sucesso!');
    } catch (err) {
      console.log(err);
      return handleErrors(err as Error);
    }
  }

  async handleDeleteAcquisitionByPurchaseId(purchaseId: number, userId: number): Promise<HttpResponse> {
    try {
      validationId(purchaseId);
      const purchase = await this.purchaseDAO.checkIfPurchaseExists(purchaseId);
      checkIsEquals(userId, purchase.user_id, 'Você não tem permissão para excluir.');

      await this.purchaseDAO.delete({
        where: {
          id: purchaseId,
        },
      });

      return ok('Gasto/Compra deleta com sucesso!');
    } catch (err) {
      console.log(err);
      return handleErrors(err as Error);
    }
  }

  async handleGetAcquisitionsByPaymentId(paymentId: number): Promise<HttpResponse> {
    try {
      validationId(paymentId);
      await this.paymentDAO.checkIfPaymentExists(paymentId);

      const { acquisitions, ...paymentInfo } = await this.paymentDAO.findByPaymentId(paymentId);
      const purchases = await this.purchaseDAO.returnsPurchaseByAcquisitionsList(acquisitions);

      validationField400code(purchases, 'Não há compras relacionadas a essa forma de pagamento.');

      return okWithContent({
        ...paymentInfo,
        purchases,
      });
    } catch (err) {
      console.log(err);
      return handleErrors(err as Error);
    }
  }

  async checkAllPaymentsExists(payments: AddPayment[]): Promise<void> {
    for (const payment of payments) {
      await this.paymentDAO.checkIfPaymentExists(payment.paymentId);
    }
  }

  async handleAddPayWithRelations(payments: AddPayment[], purchase: PurchaseModel): Promise<void> {
    payments.forEach(async (payment) => {
      await this.payWithDAO.add({
        payment_id: payment.paymentId,
        purchase_id: purchase.id as number,
        value: payment.value,
      });
    });
  }

  async handleAddPurchase(infos: AddPurchase): Promise<HttpResponse> {
    try {
      const {
        description, purchase_date, value, user_id, payments,
      } = infos;

      validationField400code(description, 'Descrição de compra inválida.');
      validationExpenseValue(value, 'Valor do gasto tem que ser maior que zero.');
      await this.userDAO.checkIfUserExists(user_id);
      await this.checkAllPaymentsExists(payments);

      const date = new Date(purchase_date).toISOString().split('T')[0];
      const year = Number(date.split('-')[0]);
      const month = Number(date.split('-')[1]);
      const day = Number(date.split('-')[2]);
      const setedDate = new Date(Date.UTC(year, month, day, 3, 0, 0));

      const result = await this.purchaseDAO.add({
        description,
        purchase_date: setedDate,
        user_id,
        value,
      }) as PurchaseModel;

      validationField400code(result, 'Não foi possível encontrar os gastos.');

      await this.handleAddPayWithRelations(payments, result);

      return created('Compra cadastrada com sucesso!');
    } catch (err) {
      console.log(err);
      return handleErrors(err as Error);
    }
  }
}
