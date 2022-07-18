/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
import {
  checkIfExists404code,
  checkIsEquals403Error,
  validationField400code,
} from '../helpers/validations';
import PaymentDAOImp from '../../DAOImp/payment/PaymentDAOImp';
import PayWithDAOImp from '../../DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../DAOImp/purchase/PurchaseDAOImp';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';
import * as pur from '../../data/models/PurchaseModel';
import PurchaseModel from '../../data/models/PurchaseModel';
import type AddPurchase from '../../data/usecases/AddPurchase';
import type { AddPayment } from '../../data/usecases/AddPurchase';
import {
  created, okWithContent, HttpResponse, ok,
} from '../helpers/http';
import type UpdatePurchase from '../../data/usecases/UpdatePurchase';
import Catch from '../../decorators/Catch';
import UpdateCurrentValue from '../../data/usecases/UpdateCurrentValue';
import IsValid from '../../decorators/IsValid';
import PageIsValid from '../../decorators/PageIsValid';
import { GetAcquisitionsByPaymentId } from '../../data/usecases/GetAcquisitonsByPaymentId';

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
  @IsValid({ idPosition: 0 })
  async handleDeleteAcquisitionsByPaymentId(paymentId: number, userId: number): Promise<HttpResponse> {
    await this.paymentDAO.checkIfPaymentExists(paymentId);

    const { acquisitions, user_id } = await this.paymentDAO.findByPaymentId(paymentId);
    checkIsEquals403Error(userId, user_id, 'Você não tem permissão para acessar este conteúdo.');
    checkIfExists404code(acquisitions, 'Não existe compras/gastos pagas com essa forma de pagamento.');
    await this.purchaseDAO.deletePurchasesByAcquisisitionList(acquisitions);

    return ok('Gastos/Compras deletas com sucesso!');
  }

  @Catch()
  @IsValid({ idPosition: 0 })
  async handleGetAcquisitionsByPaymentId(paymentId: number, userId: number): Promise<HttpResponse> {
    await this.paymentDAO.checkIfPaymentExists(paymentId);

    const { acquisitions, default_value, ...paymentInfo } = await this.paymentDAO.findByPaymentId(paymentId);
    const purchases = await this.purchaseDAO.returnsPurchaseByAcquisitionsList(acquisitions) as unknown as pur.PurchaseModelWithCreateData[];

    checkIfExists404code(purchases, 'Não há compras relacionadas a essa forma de pagamento.');
    checkIsEquals403Error(purchases[0].user_id, userId, 'Você não tem permissão para acessar este conteúdo.');

    const content: GetAcquisitionsByPaymentId = {
      ...paymentInfo,
      default_value,
      purchases,
    };

    return okWithContent(content);
  }

  @Catch()
  @IsValid({ idPosition: 0 })
  @PageIsValid({ argPosition: 1 })
  async handleGetAcquisitionsByPaymentIdWithPagination(paymentId: number, page: number, userId: number): Promise<HttpResponse> {
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
    const results = [];
    for (const payment of payments) {
      results.push(this.paymentDAO.checkIfPaymentExists(payment.paymentId));
    }

    await Promise.all(results);
  }

  async handleAddPayWithRelations(payments: AddPayment[], purchase: PurchaseModel): Promise<void> {
    payments.forEach(async (payment) => {
      await this.paymentDAO.update({
        where: {
          id: payment.paymentId,
        },

        data: {
          current_value: {
            decrement: payment.value,
          },
        },
      });

      await this.payWithDAO.add({
        payment_id: payment.paymentId,
        purchase_id: purchase.id as number,
        value: payment.value,
      });
    });
  }

  @Catch()
  @IsValid({
    notEmpty: ['description', 'value'],
    validationValueMsg: 'Valor do gasto tem que ser maior que zero.',
    messageError: ['Descrição é requerido.', 'Valor de compra é requerido.'],
  })
  async handleAddPurchase(infos: AddPurchase): Promise<HttpResponse> {
    const {
      description, purchase_date, value, user_id, payments,
    } = infos;

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
    const results = [];
    for (const payment of payments) {
      if (payment.payWithId) {
        results.push(this.payWithDAO.update({
          where: {
            id: payment.payWithId,
          },

          data: {
            value: payment.value,
          },
        }));
      } else {
        results.push(this.payWithDAO.add({
          payment_id: payment.paymentId,
          purchase_id: purchaseId,
          value: payment.value,
        }));
      }
    }

    await Promise.all(results);
  }

  async handleEditCurrentValueInPurchaseDeletation(id: number) {
    const { PayWith }: UpdateCurrentValue = await this.purchaseDAO.findUnique({
      where: {
        id,
      },

      select: {
        PayWith: {
          select: {
            payment_id: true,
            value: true,
          },
        },
      },
    }) as unknown as UpdateCurrentValue;

    const results = [];
    for (const pay of PayWith) {
      results.push(this.paymentDAO.addAdditionValue({ paymentId: pay.payment_id, additionalValue: pay.value }));
    }

    await Promise.all(results);
  }

  @Catch()
  @IsValid({ idPosition: 0 })
  async handleDeleteAcquisitionByPurchaseId(purchaseId: number, userId: number): Promise<HttpResponse> {
    const purchase = await this.purchaseDAO.checkIfPurchaseExists(purchaseId);
    checkIsEquals403Error(userId, purchase.user_id, 'Você não tem permissão para acessar este conteúdo.');
    await this.handleEditCurrentValueInPurchaseDeletation(purchaseId);
    await this.purchaseDAO.delete({
      where: {
        id: purchaseId,
      },
    });

    return ok('Gasto/Compra deleta com sucesso!');
  }

  async handleDeletePayWiths(deleteList: number[]): Promise<void> {
    const results = [];
    for (const item of deleteList) {
      results.push(this.payWithDAO.delete({
        where: {
          id: item,
        },
      }));
    }

    await Promise.all(results);
  }

  @Catch()
  @IsValid({
    notEmpty: ['description', 'value'],
    validationValueMsg: 'Valor do gasto tem que ser maior que zero.',
    messageError: ['Descrição é requerido.', 'Valor de compra é requerido.'],
  })
  async handleUpdatePurchase(infos: UpdatePurchase, userId: number): Promise<HttpResponse> {
    const {
      id, description, purchase_date, value, user_id, payments, payWithDeleteds,
    } = infos;
    checkIsEquals403Error(user_id, userId, 'Você não tem permissão para acessar este conteúdo.');

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
