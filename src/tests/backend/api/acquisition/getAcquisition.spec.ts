/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import AcquisitionController from '../../../../serverless/api/controllers/AcquisitionController';
import {
  badRequest, HttpResponse, okWithContent, serverError,
} from '../../../../serverless/api/helpers/http';
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';
import PayWithDAOImp from '../../../../serverless/DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../../../serverless/DAOImp/purchase/PurchaseDAOImp';
import { ReturnsAcquisitions } from '../../../../serverless/data/usecases/GetAcquisitions';
import mockPaymentDAOImp from '../../../mocks/mockPaymentDAOImp';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';

jest.mock('../../../mocks/mockUserDAOImp');
jest.mock('../../../mocks/mockPaymentDAOImp');

const makeSut = (): AcquisitionController => {
  const payWithtDAOStub = new PayWithDAOImp();
  const purchaseDAOStub = new PurchaseDAOImp();
  const paymentDAO = new PaymentDAOImp();

  const acquisitionControlerStub = new AcquisitionController(paymentDAO, purchaseDAOStub, payWithtDAOStub, mockUserDAOImp);

  return acquisitionControlerStub;
};

describe('Get acquisitions tests', () => {
  test('Should return 400 if id is invalid', async () => {
    const paymentId = -1;

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentId(paymentId);
    expect(httpResponse).toEqual(badRequest('ID inválido.'));
  });

  test('Should return 400 if user not exists', async () => {
    const paymentId = 1;

    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve(false);
      return result;
    });

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentId(paymentId);
    expect(httpResponse).toEqual(badRequest('Usuário não existe.'));
  });

  test('Should return 400 if no exists purchases', async () => {
    const paymentId = 1;
    const date = new Date();

    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve(true);
      return result;
    });

    jest.spyOn(PaymentDAOImp.prototype, 'findByPaymentId').mockImplementationOnce(async (infos) => {
      const result: ReturnsAcquisitions = await Promise.resolve({
        acquisitions: [{
          payment_id: 1,
          purchase_id: 1,
          value: 1,
        }],
        default_value: 800,
        nickname: 'nickname',
        reset_day: 1,
        user_id: 1,
      });
      return result;
    });

    jest.spyOn(PurchaseDAOImp.prototype, 'returnsPurchaseByAcquisitionsList').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve(undefined);
      return result;
    });

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentId(paymentId);
    expect(httpResponse).toEqual(badRequest('Não a compras relacionadas a essa forma de pagamento.'));
  });

  test('Should return 500 if any error occurs', async () => {
    const paymentId = 1;

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(async (infos) => {
      throw new Error('Error');
    });

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentId(paymentId);
    expect(httpResponse).toEqual(serverError('Erro no servidor, tente novamente mais tarde.'));
  });

  test('Should return 200 and acquisitions informations', async () => {
    const paymentId = 1;
    const date = new Date();

    jest.spyOn(PaymentDAOImp.prototype, 'findByPaymentId').mockImplementationOnce(async (infos) => {
      const result: ReturnsAcquisitions = await Promise.resolve({
        acquisitions: [{
          payment_id: 1,
          purchase_id: 1,
          value: 1,
        }],
        default_value: 800,
        nickname: 'nickname',
        reset_day: 1,
        user_id: 1,
      });
      return result;
    });

    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve(true);
      return result;
    });

    jest.spyOn(PurchaseDAOImp.prototype, 'returnsPurchaseByAcquisitionsList').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve([{
        id: 51,
        value: 25.7,
        description: 'Almoço nas Bahamas',
        purchase_date: date,
        user_id: 718,
      },
      {
        id: 53,
        value: 12,
        description: 'teste',
        purchase_date: date,
        user_id: 718,
      }]);

      return result;
    });

    const acquisitionController = makeSut();

    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentId(paymentId);

    expect(httpResponse).toEqual(okWithContent({
      purchases: [{
        id: 51,
        value: 25.7,
        description: 'Almoço nas Bahamas',
        purchase_date: date,
        user_id: 718,
      },
      {
        id: 53,
        value: 12,
        description: 'teste',
        purchase_date: date,
        user_id: 718,
      }],
      default_value: 800,
      nickname: 'nickname',
      reset_day: 1,
      user_id: 1,
    }));
  });
});
