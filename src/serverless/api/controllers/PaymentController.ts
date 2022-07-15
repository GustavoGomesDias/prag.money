/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import type PaymentModel from '../../data/models/PaymentModel';
import PaymentDAOImp from '../../DAOImp/payment/PaymentDAOImp';
import {
  HttpResponse, ok, okWithContent,
} from '../helpers/http';
import {
  checkIsEquals403Error, validationField400code,
} from '../helpers/validations';
import Catch from '../../decorators/Catch';
import type AddAdditionalValue from '../../data/usecases/AddAdditionalValue';
import IsValid from '../../decorators/IsValid';
import IsDayOfTheMonth from '../../decorators/IsDayOfTheMonth';
import IsNumber from '../../decorators/IsNumber';

export default class PaymentController {
  private readonly paymentDAOImp: PaymentDAOImp;

  constructor(paymentDAOImp: PaymentDAOImp) {
    this.paymentDAOImp = paymentDAOImp;
  }

  @Catch()
  @IsValid({ idPosition: 0 })
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

  @Catch()
  @IsValid({
    paramName: 'paymentInfos',
    notEmpty: ['nickname', 'default_value'],
    messageError: [
      'É preciso dar um apelido para a forma de pagamento.',
      'É preciso dar um valor padrão para a forma de pagamento.',
    ],
    fieldIdIsValid: 'user_id',
  })
  @IsDayOfTheMonth({ paramName: 'paymentInfos', fieldName: 'reset_day' })
  async handleAdd(paymentInfos: PaymentModel): Promise<HttpResponse> {
    await this.paymentDAOImp.add(paymentInfos);
    return ok('Forma de pagamento criado com sucesso!');
  }

  @Catch()
  @IsNumber({ paramName: 'paymentInfos', argName: 'current_value' })
  @IsValid({
    paramName: 'paymentInfos',
    notEmpty: ['nickname', 'default_value'],
    messageError: ['Nickname (apelido) é requerido.', 'É preciso dar um valor padrão para a forma de pagamento.'],
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
  @IsNumber({ paramName: 'infos', argName: 'additionalValue' })
  @IsValid({
    paramName: 'infos',
    fieldIdIsValid: 'paymentId',
    notEmpty: ['additionalValue'],
    messageError: ['Valor adcional é requerido.'],
  })
  async handleAddAdditionalValue(infos: AddAdditionalValue, userId: number): Promise<HttpResponse> {
    checkIsEquals403Error(userId, infos.userId, 'Você não tem permissão para editar.');

    await this.paymentDAOImp.addAdditionValue(infos);

    return ok('Valor adicional adicionado com sucesso!');
  }

  @Catch()
  @IsValid({ idPosition: 0 })
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
