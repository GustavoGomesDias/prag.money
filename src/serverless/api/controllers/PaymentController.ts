/* eslint-disable camelcase */
import { validationDay } from '../../../utils/validations';
import PaymentModel from '../../data/models/PaymentModel';
import PaymentDAOImp from '../../DAOImp/payment/PaymentDAOImp';
import {
  HttpResponse, ok, okWithContent,
} from '../helpers/http';
import {
  checkIsEquals403Error, validationField400code, validationId, validationValues,
} from '../helpers/Validations';
import { BadRequestError } from '../../error/HttpError';
import Catch from '../../decorators/Catch';
import AddAdditionalValue from '../../data/usecases/AddAdditionalValue';

export default class PaymentController {
  private readonly paymentDAOImp: PaymentDAOImp;

  constructor(paymentDAOImp: PaymentDAOImp) {
    this.paymentDAOImp = paymentDAOImp;
  }

  @Catch()
  async handleGetPaymentById(paymentId: number, userId: number): Promise<HttpResponse> {
    validationId(paymentId);

    const payment = await this.paymentDAOImp.findUnique({
      where: {
        id: paymentId,
      },
    }) as PaymentModel;

    checkIsEquals403Error(payment.user_id, userId, 'Você não tem permissão para acessar está informação.');

    return okWithContent({ payment });
  }

  validatieAllRequestFields(paymentInfos: PaymentModel): void {
    const {
      default_value, nickname, reset_day, user_id, additional_value,
    } = paymentInfos;

    validationField400code(nickname, 'É preciso dar um apelido para a forma de pagamento.');
    validationField400code(default_value, 'É preciso dar um valor padrão para a forma de pagamento.');
    validationValues(default_value, 'É preciso dar um valor padrão para a forma de pagamento.');
    if (additional_value !== undefined || Number.isNaN(additional_value)) {
      validationField400code(additional_value, 'Valor adicional precisa ser um número e maior/igual que zero.');
      validationValues(additional_value as number, 'Valor adicional precisa ser um número e maior/igual que zero.');
    }
    validationId(user_id);

    if (!validationDay(reset_day)) {
      throw new BadRequestError('Por favor, forneça um dia que seja valido.');
    }
  }

  @Catch()
  async handleAdd(paymentInfos: PaymentModel): Promise<HttpResponse> {
    this.validatieAllRequestFields(paymentInfos);

    await this.paymentDAOImp.add(paymentInfos);

    return ok('Forma de pagamento criado com sucesso!');
  }

  @Catch()
  async handleEdit(paymentInfos: PaymentModel, userId: number): Promise<HttpResponse> {
    this.validatieAllRequestFields(paymentInfos);
    checkIsEquals403Error(userId, paymentInfos.user_id, 'Você não tem permissão para editar.');

    await this.paymentDAOImp.update({
      where: {
        id: paymentInfos.id,
      },
      data: paymentInfos,
    });

    return ok('Forma de pagamento editada com sucesso!');
  }

  @Catch()
  async handleAddAdditionalValue(infos: AddAdditionalValue, userId: number): Promise<HttpResponse> {
    validationId(infos.userId);
    validationId(infos.paymentId);
    validationField400code(infos.additionalValue, 'Valor adicional precisa ser um número e maior/igual que zero.');
    validationValues(infos.additionalValue, 'Valor adicional precisa ser um número e maior/igual que zero.');
    checkIsEquals403Error(userId, infos.userId, 'Você não tem permissão para editar.');

    await this.paymentDAOImp.update({
      where: {
        id: infos.paymentId,
      },
      data: {
        additional_value: {
          increment: infos.additionalValue,
        },
      },
    });

    return ok('Valor adicional adicionado com sucesso!');
  }

  @Catch()
  async handleDelete(paymentId: number, userId: number): Promise<HttpResponse> {
    validationId(paymentId);

    const payment = await this.paymentDAOImp.findByPaymentId(paymentId);

    checkIsEquals403Error(userId, payment.user_id, 'Você não tem permissão para acessar esse contaúdo.');
    await this.paymentDAOImp.delete({
      where: {
        id: paymentId,
      },
    });

    return ok('Forma de pagamento deletada com sucesso!');
  }
}
