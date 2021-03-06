/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import AcquisitionController from '../../../../serverless/api/controllers/AcquisitionController';
import {
  badRequest, created, HttpResponse, notFound, serverError,
} from '../../../../serverless/api/helpers/http';
import AddPurchase from '../../../../serverless/data/usecases/AddPurchase';
import PayWithDAOImp from '../../../../serverless/DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../../../serverless/DAOImp/purchase/PurchaseDAOImp';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';
import { BadRequestError, InternalServerError, NotFoundError } from '../../../../serverless/error/HttpError';
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';

jest.mock('../../../mocks/mockUserDAOImp');
jest.mock('../../../mocks/mockPaymentDAOImp');

const makeSut = (): AcquisitionController => {
  const payWithtDAOStub = new PayWithDAOImp();
  const purchaseDAOStub = new PurchaseDAOImp();
  const paymentDAO = new PaymentDAOImp();

  const acquisitionControlerStub = new AcquisitionController(paymentDAO, purchaseDAOStub, payWithtDAOStub, mockUserDAOImp);

  return acquisitionControlerStub;
};

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => jest.restoreAllMocks());

describe('Add acquisition tests', () => {
  test('Should return 400 if no description is provided', async () => {
    const infos: AddPurchase = {
      description: '',
      purchase_date: new Date('2021-1-1'),
      value: 50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
    };
    const acquisitionControler = makeSut();

    const httpResponse: HttpResponse = await acquisitionControler.handleAddPurchase(infos);

    expect(httpResponse).toEqual(badRequest(new BadRequestError('Descrição é requerido.')));
  });

  test('Should return 400 if value is invalid', async () => {
    const infos: AddPurchase = {
      description: 'descripion',
      purchase_date: new Date('2021-1-1'),
      value: -50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
    };
    const acquisitionControler = makeSut();

    const httpResponse: HttpResponse = await acquisitionControler.handleAddPurchase(infos);

    expect(httpResponse).toEqual(badRequest(new BadRequestError('Valor do gasto tem que ser maior que zero.')));
  });

  test('Should return 400 if user not exists', async () => {
    const infos: AddPurchase = {
      description: 'descripion',
      purchase_date: new Date('2021-1-1'),
      value: 50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
    };

    jest.spyOn(mockUserDAOImp, 'checkIfUserExists').mockImplementationOnce(async (infos) => {
      await Promise.reject(new NotFoundError('Usuário não existe.'));
    });
    const acquisitionControler = makeSut();

    const httpResponse: HttpResponse = await acquisitionControler.handleAddPurchase(infos);

    expect(httpResponse).toEqual(notFound(new NotFoundError('Usuário não existe.')));
  });

  test('Should return 400 if payment not exists', async () => {
    const infos: AddPurchase = {
      description: 'descripion',
      purchase_date: new Date('2021-1-1'),
      value: 50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
    };

    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(async (infos) => {
      await Promise.reject(new NotFoundError('Forma de pagamento não existe.'));
    });
    const acquisitionControler = makeSut();

    const httpResponse: HttpResponse = await acquisitionControler.handleAddPurchase(infos);

    expect(httpResponse).toEqual(notFound(new NotFoundError('Forma de pagamento não existe.')));
  });

  test('Should return 500 if server returns a error', async () => {
    const infos: AddPurchase = {
      description: 'descripion',
      purchase_date: new Date('2021-1-1'),
      value: 50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
    };

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(jest.fn());
    jest.spyOn(PurchaseDAOImp.prototype, 'add').mockImplementationOnce(async () => {
      throw new Error('Server Error');
    });
    const acquisitionControler = makeSut();

    const response = await acquisitionControler.handleAddPurchase(infos);

    expect(response).toEqual(serverError(new InternalServerError('Erro no servidor, tente novamente mais tarde.')));
  });

  test('Should return 201 if purchase is created', async () => {
    const infos: AddPurchase = {
      description: 'descripion',
      purchase_date: new Date('2021-1-1'),
      value: 50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
    };
    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(jest.fn());

    jest.spyOn(PayWithDAOImp.prototype, 'add').mockImplementation(async (infos) => {
      const result = await Promise.resolve({
        payment_id: 1,
        purchase_id: 1,
      });
      return result;
    });

    jest.spyOn(PurchaseDAOImp.prototype, 'add').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve({
        payment_id: 1,
        purchase_id: 1,
      });
      return result;
    });
    const userController = makeSut();

    const entity = userController['payWithDAO']['entity'];

    jest.spyOn(entity, 'create').mockImplementation(jest.fn());

    const httpResponse: HttpResponse = await userController.handleAddPurchase(infos);

    expect(httpResponse).toEqual(created('Compra cadastrada com sucesso!'));
  });
});
