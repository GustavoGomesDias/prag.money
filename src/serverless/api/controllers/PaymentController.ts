/* eslint-disable no-param-reassign */
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
import IsValid from '../../decorators/IsValid';
import IsDayOfTheMonth from '../../decorators/IsDayOfTheMonth';

export default class PaymentController {
  private readonly paymentDAOImp: PaymentDAOImp;

  constructor(paymentDAOImp: PaymentDAOImp) {
    this.paymentDAOImp = paymentDAOImp;
  }

  @Catch()
  @IsValid({ fieldIdIsValid: 'paymentId' })
  async handleGetPaymentById(paymentId: number, userId: number): Promise<HttpResponse> {
    const payment = await this.paymentDAOImp.findUnique({
      where: {
        id: paymentId,
      },
    }) as PaymentModel;

    validationField400code(payment, 'Conta não existe.');

    checkIsEquals403Error(payment.user_id, userId, 'Você não tem permissão para acessar está informação.');

    return okWithContent({ payment });
  }

  validatieAllRequestFields(paymentInfos: PaymentModel): void {
    const {
      default_value, nickname, reset_day, user_id, current_value,
    } = paymentInfos;

    validationField400code(nickname, 'É preciso dar um apelido para a forma de pagamento.');
    validationField400code(default_value, 'É preciso dar um valor padrão para a forma de pagamento.');
    validationValues(default_value, 'É preciso dar um valor padrão para a forma de pagamento.');
    if (current_value !== undefined || Number.isNaN(current_value)) {
      validationField400code(current_value, 'Valor adicional precisa ser um número e maior/igual que zero.');
      validationValues(current_value as number, 'Valor adicional precisa ser um número e maior/igual que zero.');
    }
    validationId(user_id);

    if (!validationDay(reset_day)) {
      throw new BadRequestError('Por favor, forneça um dia que seja valido.');
    }
  }

  @Catch()
  @IsValid({ paramName: 'paymentInfos', notEmpty: ['nickname', 'default_value', 'current_value'], fieldIdIsValid: 'user_id' })
  @IsDayOfTheMonth({ paramName: 'paymentInfos', fieldName: 'reset_day' })
  async handleAdd(paymentInfos: PaymentModel): Promise<HttpResponse> {
    await this.paymentDAOImp.add(paymentInfos);

    return ok('Forma de pagamento criado com sucesso!');
  }

  @Catch()
  @IsValid({
    paramName: 'paymentInfos',
    notEmpty: ['nickname', 'default_value', 'current_value'],
    fieldIdIsValid: 'user_id',
  })
  @IsDayOfTheMonth({ paramName: 'paymentInfos', fieldName: 'reset_day' })
  async handleEdit(paymentInfos: PaymentModel, userId: number): Promise<HttpResponse> {
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
  @IsValid({ fieldIdIsValid: ['userId, paymentId'], notEmpty: ['additionalValue'] })
  async handleAddAdditionalValue(infos: AddAdditionalValue, userId: number): Promise<HttpResponse> {
    checkIsEquals403Error(userId, infos.userId, 'Você não tem permissão para editar.');

    await this.paymentDAOImp.addAdditionValue(infos);

    return ok('Valor adicional adicionado com sucesso!');
  }

  @Catch()
  @IsValid({ fieldIdIsValid: 'paymentId' })
  async handleDelete(paymentId: number, userId: number): Promise<HttpResponse> {
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
