/* eslint-disable camelcase */
import { Prisma } from '@prisma/client';
import { validationDay, validationField } from '../../../utils/validations';
import PaymentModel from '../../data/models/PaymentModel';
import uniqueError from '../../error/uniqueError';
import PaymentDAOImp from '../../DAOImp/payment/PaymentDAOImp';
import {
  badRequest, HttpResponse, ok, serverError,
} from '../helpers/http';

export default class PaymentController {
  private readonly paymentDAOImp: PaymentDAOImp;

  constructor(paymentDAOImp: PaymentDAOImp) {
    this.paymentDAOImp = paymentDAOImp;
  }

  async handleAdd(paymentInfos: PaymentModel): Promise<HttpResponse> {
    try {
      const {
        default_value, nickname, reset_day, user_id,
      } = paymentInfos;

      if (validationField(nickname)) {
        return badRequest('É preciso dar um apelido para a forma de pagamento.');
      }

      if (!default_value) {
        return badRequest('É preciso dar um valor padrão para a forma de pagamento.');
      }

      if (!validationDay(reset_day)) {
        return badRequest('Por favor, forneça um dia que seja valido.');
      }

      if (!user_id) {
        return badRequest('Id de usuário inválido.');
      }

      await this.paymentDAOImp.add(paymentInfos);

      return ok('Forma de pagamento criado com sucesso!');
    } catch (err) {
      console.log(err);
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          return badRequest(`${uniqueError(err)} já existe, tente novamente.`);
        }
      }
      return serverError('Erro no servidor, tente novamente mais tarde.');
    }
  }
}
