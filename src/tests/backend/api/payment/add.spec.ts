import { Prisma } from '@prisma/client';
import PaymentController from '../../../../serverless/api/controllers/PaymentController';
import { badRequest, HttpResponse, ok } from '../../../../serverless/api/helpers/http';
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
      reset_day: 1,
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
      reset_day: 1,
      user_id: 1,
    }

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos);

    expect(response).toEqual(badRequest('É preciso dar um valor padrão para a forma de pagamento.'))
  });

  test('Should return 400 if incorrect reset day is provided', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: -1,
      user_id: 1,
    }

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos);

    expect(response).toEqual(badRequest('Por favor, forneça um dia que seja valido.'))
  });

  test('Should return 400 if no user id is provided', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: NaN,
    }

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos);

    expect(response).toEqual(badRequest('Id de usuário inválido.'))
  });

  test('Should return 400 if unique field (nickname) already existis', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: 1,
    }

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(PaymentRepositoryMocked, 'add').mockImplementationOnce(async () => {
      throw new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`nickname`)', 'P2002', '3.9.1')
    });
    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos);

    expect(response).toEqual(badRequest('Nickname já existe, tente novamente.'))
  });

  test('Should return 200 if user is creted', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: 1,
    }
    
    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos);

    expect(response).toEqual(ok('Forma de pagamento criado com sucesso!'))
  });
});