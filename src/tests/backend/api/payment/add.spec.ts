import PaymentController from '../../../../serverless/api/controllers/PaymentController';
import { badRequest, ok } from '../../../../serverless/api/helpers/http';
import PaymentModel from '../../../../serverless/data/models/PaymentModel';
import PaymentRepositoryMocked from '../../../mocks/mockPaymentRepository';

jest.mock('../../../mocks/mockPaymentRepository');

const makeSut = (): PaymentController => {

  return new PaymentController(PaymentRepositoryMocked);
}

describe('Handler Create Payment', () => {
  test('Should return 400 if no nickname is provided ', async () => {
    const infos: PaymentModel = {
      nickname: '',
      default_value: 800,
      reset_date: new Date(),
      user_id: 1,
    };

    const paymentControllerStub= makeSut();

    const response = await paymentControllerStub.handleAdd(infos);

    expect(response).toEqual(badRequest('É preciso dar um apelido para a forma de pagamento.'))
  });

  test('Should return 400 if no default value is provided ', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: NaN,
      reset_date: new Date(),
      user_id: 1,
    }

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos);

    expect(response).toEqual(badRequest('É preciso dar um valor padrão para a forma de pagamento.'))
  });

  test('Should return 400 if no payment method value reset date is provided', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_date: new Date('abc'),
      user_id: 1,
    }

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos);

    expect(response).toEqual(badRequest('Por favor, forneca uma data que seja valida.'))
  });

  test('Should return 400 if no user id is provided', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_date: new Date(),
      user_id: NaN,
    }

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos);

    expect(response).toEqual(badRequest('Id de usuário inválido.'))
  });

  test('Should return 200 if user is creted', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_date: new Date(),
      user_id: 1,
    }

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos);

    expect(response).toEqual(ok('Forma de pagamento criado com sucesso!'))
  });
});