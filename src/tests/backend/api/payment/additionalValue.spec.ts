import PaymentDAOMocked from '../../../mocks/mockPaymentDAOImp';
import PaymentController from '../../../../serverless/api/controllers/PaymentController';
import AddAdditionalValue from '../../../../serverless/data/usecases/AddAdditionalValue';
import { badRequest, forbidden, ok } from '../../../../serverless/api/helpers/http';
import { BadRequestError, ForbiddenError } from '../../../../serverless/error/HttpError';
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';

jest.mock('../../../mocks/mockPaymentDAOImp');
afterAll(() => jest.resetAllMocks());

const makeSut = (): PaymentController => new PaymentController(PaymentDAOMocked);

describe('Handle Additional Value', () => {
  test('Should return 400 if user id is invalid', async () => {
    const infos: AddAdditionalValue = {
      additionalValue: 1,
      paymentId: 1,
      userId: -1,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAddAdditionalValue(infos, 1);

    expect(response).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if payment id is invalid', async () => {
    const infos: AddAdditionalValue = {
      additionalValue: 1,
      paymentId: -1,
      userId: 1,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAddAdditionalValue(infos, 1);

    expect(response).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if additional value is invalid', async () => {
    const infos: AddAdditionalValue = {
      additionalValue: NaN,
      paymentId: 1,
      userId: 1,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAddAdditionalValue(infos, 1);

    expect(response).toEqual(badRequest(new BadRequestError('Valor adicional precisa ser um número e maior/igual que zero.')));
  });

  test('Should return 400 if additional value is less than zero', async () => {
    const infos: AddAdditionalValue = {
      additionalValue: -1,
      paymentId: 1,
      userId: 1,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAddAdditionalValue(infos, 1);

    expect(response).toEqual(badRequest(new BadRequestError('Valor adicional precisa ser um número e maior/igual que zero.')));
  });

  test('Should return 403 if user id in info is different logged user id', async () => {
    const infos: AddAdditionalValue = {
      additionalValue: 1,
      paymentId: 1,
      userId: 1,
    };

    const paymentControllerStub = makeSut();

    const response = await paymentControllerStub.handleAddAdditionalValue(infos, 2);

    expect(response).toEqual(forbidden(new ForbiddenError('Você não tem permissão para editar.')));
  });

  test('Should return 200 if additional value is added', async () => {
    const infos: AddAdditionalValue = {
      additionalValue: 1,
      paymentId: 1,
      userId: 1,
    };

    jest.spyOn(PaymentDAOImp.prototype, 'update').mockImplementationOnce(jest.fn());

    const paymentControllerStub = new PaymentController(new PaymentDAOImp());

    const response = await paymentControllerStub.handleAddAdditionalValue(infos, 1);

    expect(response).toEqual(ok('Valor adicional adicionado com sucesso!'));
  });
});
