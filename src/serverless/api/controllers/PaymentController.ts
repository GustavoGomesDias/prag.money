import { validationDate, validationField } from '../../../utils/validations';
import PaymentModel from '../../data/models/PaymentModel';
import PaymentRepository from '../../repositories/payment/PaymentRepository';
import { badRequest, HttpResponse, ok, serverError } from '../helpers/http';

export default class PaymentController {
  private readonly paymentRepository: PaymentRepository;

  constructor(paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async handleAdd(paymentInfos: PaymentModel): Promise<HttpResponse> {
    try {
      const { default_value, nickname, reset_date, user_id } = paymentInfos;

      if (validationField(nickname)) {
        return badRequest('É preciso dar um apelido para a forma de pagamento.');
      }

      if (!default_value) {
        return badRequest('É preciso dar um valor padrão para a forma de pagamento.');
      }

      if (!validationDate(reset_date)) {
        return badRequest('Por favor, forneca uma data que seja valida.');
      }

      if (!user_id) {
        return badRequest('Id de usuário inválido.');
      }

      await this.paymentRepository.add(paymentInfos);

      return ok('Forma de pagamento criado com sucesso!');
    } catch (err) {
      console.log(err);

      return serverError('Erro no servidor, tente novamente mais tarde.');
    }
  }
}