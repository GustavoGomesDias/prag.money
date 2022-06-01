/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import {
  checkIfExists404code,
  checkIsEquals403Error,
  validationValues, validationField400code, validationId, validationPage,
} from '../helpers/Validations';
import PaymentDAOImp from '../../DAOImp/payment/PaymentDAOImp';
import PayWithDAOImp from '../../DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../DAOImp/purchase/PurchaseDAOImp';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';
import PurchaseModel from '../../data/models/PurchaseModel';
import AddPurchase, { AddPayment } from '../../data/usecases/AddPurchase';
import {
  created, okWithContent, HttpResponse, ok,
} from '../helpers/http';
import UpdatePurchase from '../../data/usecases/UpdatePurchase';
import Catch from '../../decorators/Catch';

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

  @Catch()
  async handleDeleteAcquisitionsByPaymentId(paymentId: number, userId: number): Promise<HttpResponse> {
    validationId(paymentId);
    await this.paymentDAO.checkIfPaymentExists(paymentId);

    const { acquisitions, user_id } = await this.paymentDAO.findByPaymentId(paymentId);
    checkIsEquals403Error(userId, user_id, 'Você não tem permissão para acessar este conteúdo.');
    checkIfExists404code(acquisitions, 'Não existe compras/gastos pagas com essa forma de pagamento.');
    await this.purchaseDAO.deletePurchasesByAcquisisitionList(acquisitions);

    return ok('Gastos/Compras deletas com sucesso!');
  }

  @Catch()
  async handleDeleteAcquisitionByPurchaseId(purchaseId: number, userId: number): Promise<HttpResponse> {
    validationId(purchaseId);
    const purchase = await this.purchaseDAO.checkIfPurchaseExists(purchaseId);
    checkIsEquals403Error(userId, purchase.user_id, 'Você não tem permissão para acessar este conteúdo.');

    await this.purchaseDAO.delete({
      where: {
        id: purchaseId,
      },
    });

    return ok('Gasto/Compra deleta com sucesso!');
  }

  @Catch()
  async handleGetAcquisitionsByPaymentId(paymentId: number, userId: number): Promise<HttpResponse> {
    validationId(paymentId);
    await this.paymentDAO.checkIfPaymentExists(paymentId);

    const { acquisitions, default_value, ...paymentInfo } = await this.paymentDAO.findByPaymentId(paymentId);
    const purchases = await this.purchaseDAO.returnsPurchaseByAcquisitionsList(acquisitions);

    checkIfExists404code(purchases, 'Não há compras relacionadas a essa forma de pagamento.');
    checkIsEquals403Error(purchases[0].user_id, userId, 'Você não tem permissão para acessar este conteúdo.');

    return okWithContent({
      ...paymentInfo,
      default_value,
      purchases,
    });
  }

  @Catch()
  async handleGetAcquisitionsByPaymentIdWithPagination(paymentId: number, page: number, userId: number): Promise<HttpResponse> {
    validationId(paymentId);
    validationPage(page);
    await this.paymentDAO.checkIfPaymentExists(paymentId);

    const { acquisitions, ...paymentInfo } = await this.paymentDAO.findByPaymentIdWithPagination(paymentId, page);
    checkIsEquals403Error(paymentInfo.user_id, userId, 'Você não tem permissão para acessar essa informação.');
    validationField400code(acquisitions[0], 'Não há mais compras relacionadas a essa forma de pagamento.');
    const purchases = await this.purchaseDAO.returnsPurchaseByAcquisitionsList(acquisitions);

    checkIfExists404code(purchases, 'Não há compras relacionadas a essa forma de pagamento.');

    return okWithContent({
      ...paymentInfo,
      purchases,
    });
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

  @Catch()
  async handleAddPurchase(infos: AddPurchase): Promise<HttpResponse> {
    const {
      description, purchase_date, value, user_id, payments,
    } = infos;

    validationField400code(description, 'Descrição de compra inválida.');
    validationValues(value, 'Valor do gasto tem que ser maior que zero.');
    await this.userDAO.checkIfUserExists(user_id);
    await this.checkAllPaymentsExists(payments);

    const result = await this.purchaseDAO.add({
      description,
      purchase_date,
      user_id,
      value,
    }) as PurchaseModel;

    validationField400code(result, 'Não foi possível encontrar os gastos.');

    await this.handleAddPayWithRelations(payments, result);

    return created('Compra cadastrada com sucesso!');
  }

  async handleUpdatePayWithRelations(payments: AddPayment[], purchaseId: number): Promise<void> {
    for (const payment of payments) {
      if (payment.payWithId) {
        await this.payWithDAO.update({
          where: {
            id: payment.payWithId,
          },

          data: {
            value: payment.value,
          },
        });
      } else {
        await this.payWithDAO.add({
          payment_id: payment.paymentId,
          purchase_id: purchaseId,
          value: payment.value,
        });
      }
    }
  }

  async handleDeletePayWiths(deleteList: number[]): Promise<void> {
    for (const item of deleteList) {
      await this.payWithDAO.delete({
        where: {
          id: item,
        },
      });
    }
  }

  @Catch()
  async handleUpdatePurchase(infos: UpdatePurchase, userId: number): Promise<HttpResponse> {
    const {
      id, description, purchase_date, value, user_id, payments, payWithDeleteds,
    } = infos;
    checkIsEquals403Error(user_id, userId, 'Você não tem permissão para acessar este conteúdo.');

    validationField400code(description, 'Descrição de compra inválida.');
    validationValues(value, 'Valor do gasto tem que ser maior que zero.');
    await this.userDAO.checkIfUserExists(user_id);
    await this.checkAllPaymentsExists(payments);

    if (payWithDeleteds.length > 0) {
      await this.handleDeletePayWiths(payWithDeleteds);
    }

    await this.purchaseDAO.update({
      where: {
        id: id as number,
      },
      data: {
        description,
        value,
        purchase_date,
      },
    }) as PurchaseModel;

    await this.handleUpdatePayWithRelations(payments, id as number);

    return ok('Compra atualizada com sucesso!');
  }
}
