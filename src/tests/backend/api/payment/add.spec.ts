import { Prisma } from '@prisma/client';
import PaymentController from '../../../../serverless/api/controllers/PaymentController';
import { badRequest, ok, serverError } from '../../../../serverless/api/helpers/http';
import PaymentModel from '../../../../serverless/data/models/PaymentModel';
import { BadRequestError, InternalServerError } from '../../../../serverless/error/HttpError';
import PaymentDAOMocked from '../../../mocks/mockPaymentDAOImp';

jest.mock('../../../mocks/mockPaymentDAOImp');

const makeSut = (): PaymentController => new PaymentController(PaymentDAOMocked);

describe('Handler Create Payment', () => {
  test('Should return 400 if no nickname is provided ', async () => {
    const infos: Omit<PaymentModel, 'current_month'> = {
      nickname: '',
      default_value: 800,
      reset_day: 1,
      user_id: 1,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos as PaymentModel);

    expect(response).toEqual(badRequest(new BadRequestError('É preciso dar um apelido para a forma de pagamento.')));
  });

  test('Should return 400 if no default value is provided ', async () => {
    const infos: Omit<PaymentModel, 'current_month'> = {
      nickname: 'nickname',
      default_value: NaN,
      reset_day: 1,
      user_id: 1,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos as PaymentModel);

    expect(response).toEqual(badRequest(new BadRequestError('É preciso dar um valor padrão para a forma de pagamento.')));
  });

  test('Should return 400 if default value is less than zero ', async () => {
    const infos: Omit<PaymentModel, 'current_month'> = {
      nickname: 'nickname',
      default_value: -1,
      reset_day: 1,
      user_id: 1,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos as PaymentModel);

    expect(response).toEqual(badRequest(new BadRequestError('É preciso dar um valor padrão para a forma de pagamento.')));
  });

  test('Should return 400 if incorrect reset day is provided', async () => {
    const infos: Omit<PaymentModel, 'current_month'> = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: -1,
      user_id: 1,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos as PaymentModel);

    expect(response).toEqual(badRequest(new BadRequestError('Por favor, forneça um dia que seja valido.')));
  });

  test('Should return 400 if no user id is provided', async () => {
    const infos: Omit<PaymentModel, 'current_month'> = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: NaN,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos as PaymentModel);

    expect(response).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if unique field (nickname) already existis', async () => {
    const infos: Omit<PaymentModel, 'current_month'> = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: 1,
    };

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(PaymentDAOMocked, 'add').mockImplementationOnce(async () => {
      throw new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`nickname`)', 'P2002', '3.9.1');
    });
    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos as PaymentModel);

    expect(response).toEqual(badRequest(new BadRequestError('Nickname já existe, tente novamente.')));
  });

  test('Should return 500 if server returns a error', async () => {
    const infos: Omit<PaymentModel, 'current_month'> = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: 1,
    };

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(PaymentDAOMocked, 'add').mockImplementationOnce(async () => {
      throw new Error('Server Error');
    });
    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos as PaymentModel);

    expect(response).toEqual(serverError(new InternalServerError('Erro no servidor, tente novamente mais tarde.')));
  });

  test('Should return 200 if user is creted', async () => {
    const infos: Omit<PaymentModel, 'current_month'> = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: 1,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAdd(infos as PaymentModel);

    expect(response).toEqual(ok('Forma de pagamento criado com sucesso!'));
  });
});
