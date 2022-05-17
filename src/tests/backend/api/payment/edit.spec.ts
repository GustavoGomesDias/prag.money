import PaymentController from '../../../../serverless/api/controllers/PaymentController';
import { badRequest, ok, serverError } from '../../../../serverless/api/helpers/http';
import PaymentModel from '../../../../serverless/data/models/PaymentModel';
import { BadRequestError, InternalServerError } from '../../../../serverless/error/HttpError';
import PaymentDAOMocked from '../../../mocks/mockPaymentDAOImp';
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';

jest.mock('../../../mocks/mockPaymentDAOImp');

const makeSut = (): PaymentController => new PaymentController(PaymentDAOMocked);

describe('Handler Create Payment', () => {
  test('Should return 400 if no nickname is provided ', async () => {
    const infos: PaymentModel = {
      nickname: '',
      default_value: 800,
      reset_day: 1,
      user_id: 1,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleEdit(infos, 1);

    expect(response).toEqual(badRequest(new BadRequestError('É preciso dar um apelido para a forma de pagamento.')));
  });

  test('Should return 400 if no default value is provided ', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: NaN,
      reset_day: 1,
      user_id: 1,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleEdit(infos, 1);

    expect(response).toEqual(badRequest(new BadRequestError('É preciso dar um valor padrão para a forma de pagamento.')));
  });

  test('Should return 400 if incorrect reset day is provided', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: -1,
      user_id: 1,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleEdit(infos, 1);

    expect(response).toEqual(badRequest(new BadRequestError('Por favor, forneça um dia que seja valido.')));
  });

  test('Should return 400 if no user id is provided', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: NaN,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleEdit(infos, 1);

    expect(response).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if user id is no equal to payment.user_id', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: 2,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleEdit(infos, 1);

    expect(response).toEqual(badRequest(new BadRequestError('Você não tem permissão para editar.')));
  });

  test('Should return 500 if server returns a error', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: 1,
    };

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(PaymentDAOImp.prototype, 'update').mockImplementationOnce(async () => {
      throw new Error('Server Error');
    });
    const paymentControllerStub = new PaymentController(new PaymentDAOImp());

    const response = await paymentControllerStub.handleEdit(infos, 1);

    expect(response).toEqual(serverError(new InternalServerError('Erro no servidor, tente novamente mais tarde.')));
  });

  test('Should return 200 if user is edited', async () => {
    const infos: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: 1,
    };

    jest.spyOn(PaymentDAOImp.prototype, 'update').mockImplementationOnce(jest.fn());

    const paymentControllerStub = new PaymentController(new PaymentDAOImp());

    const response = await paymentControllerStub.handleEdit(infos, 1);

    expect(response).toEqual(ok('Forma de pagamento editada com sucesso!'));
  });
});
