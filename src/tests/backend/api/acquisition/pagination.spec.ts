/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import AcquisitionController from '../../../../serverless/api/controllers/AcquisitionController';
import {
  badRequest, HttpResponse, notFound, okWithContent, serverError,
} from '../../../../serverless/api/helpers/http';
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';
import PayWithDAOImp from '../../../../serverless/DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../../../serverless/DAOImp/purchase/PurchaseDAOImp';
import { ReturnsAcquisitions } from '../../../../serverless/data/usecases/GetAcquisitions';
import { BadRequestError, InternalServerError, NotFoundError } from '../../../../serverless/error/HttpError';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';
import mockReturnsAcquisiton from '../../../mocks/acquisitons/mockReturnsAcquisitionsUseCase';
import returnPurchaseInfos from '../../../mocks/acquisitons/mockPurchasesInfos';
import * as validations from '../../../../serverless/api/helpers/Validations';

jest.mock('../../../mocks/mockUserDAOImp');
jest.mock('../../../mocks/mockPaymentDAOImp');

const makeSut = (): AcquisitionController => {
  const payWithtDAOStub = new PayWithDAOImp();
  const purchaseDAOStub = new PurchaseDAOImp();
  const paymentDAO = new PaymentDAOImp();

  const acquisitionControlerStub = new AcquisitionController(paymentDAO, purchaseDAOStub, payWithtDAOStub, mockUserDAOImp);

  return acquisitionControlerStub;
};

beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.resetAllMocks());

describe('Get acquisitions tests', () => {
  test('Should return 400 if id is invalid', async () => {
    const paymentId = -1;

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentIdWithPagination(paymentId, 1, 1);
    expect(httpResponse).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if id is string', async () => {
    const paymentId = '-1';

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentIdWithPagination(paymentId as unknown as number, 1, 1);
    expect(httpResponse).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if id is string and converted to number', async () => {
    const paymentId = 'aa';

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentIdWithPagination(Number(paymentId), 1, 1);
    expect(httpResponse).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 404 if payment not exists', async () => {
    const paymentId = 1;

    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(async (infos) => {
      await Promise.reject(new NotFoundError('Forma de pagamento não cadastrada.'));
    });

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentIdWithPagination(paymentId, 1, 1);
    expect(httpResponse).toEqual(notFound(new NotFoundError('Forma de pagamento não cadastrada.')));
  });

  test('Should return 400 if page number is invalid', async () => {
    const page = -1;

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentIdWithPagination(1, page, 1);
    expect(httpResponse).toEqual(badRequest(new BadRequestError('Página inválida.')));
  });

  test('Should return 404 if payment not exists', async () => {
    const paymentId = 1;

    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(async (infos) => {
      await Promise.reject(new NotFoundError('Forma de pagamento não cadastrada.'));
    });

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentIdWithPagination(paymentId, 1, 1);
    expect(httpResponse).toEqual(notFound(new NotFoundError('Forma de pagamento não cadastrada.')));
  });

  test('Should return 400 if no exists purchases', async () => {
    const paymentId = 1;
    const date = new Date();

    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(jest.fn());

    jest.spyOn(PaymentDAOImp.prototype, 'findByPaymentIdWithPagination').mockImplementationOnce(async (infos) => {
      const result: ReturnsAcquisitions = await Promise.resolve({ ...mockReturnsAcquisiton });
      return result;
    });

    jest.spyOn(validations, 'validationField400code').mockImplementationOnce(jest.fn());
    jest.spyOn(validations, 'checkIsEquals403Error').mockImplementationOnce(jest.fn());

    jest.spyOn(PurchaseDAOImp.prototype, 'returnsPurchaseByAcquisitionsList').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve([]);
      return result;
    });

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentIdWithPagination(paymentId, 1, 1);
    expect(httpResponse).toEqual(notFound(new NotFoundError('Não há compras relacionadas a essa forma de pagamento.')));
  });

  test('Should return 500 if any error occurs', async () => {
    const paymentId = 1;

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(async (infos) => {
      throw new Error('Error');
    });

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentIdWithPagination(paymentId, 1, 1);
    expect(httpResponse).toEqual(
      serverError(new InternalServerError('Erro no servidor, tente novamente mais tarde.')),
    );
  });

  test('Should return 200 and acquisitions informations', async () => {
    const paymentId = 1;
    const date = new Date();

    jest.spyOn(PaymentDAOImp.prototype, 'findByPaymentIdWithPagination').mockImplementationOnce(async (infos) => {
      const result: ReturnsAcquisitions = await Promise.resolve({ ...mockReturnsAcquisiton });
      return result;
    });

    jest.spyOn(validations, 'validationField400code').mockImplementationOnce(jest.fn());
    jest.spyOn(validations, 'checkIsEquals403Error').mockImplementationOnce(jest.fn());

    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(jest.fn());

    jest.spyOn(PurchaseDAOImp.prototype, 'returnsPurchaseByAcquisitionsList').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve([returnPurchaseInfos(date)]);

      return result;
    });

    const acquisitionController = makeSut();

    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentIdWithPagination(paymentId, 1, 1);

    expect(httpResponse).toEqual(okWithContent({
      purchases: [returnPurchaseInfos(date)],
      default_value: 800,
      nickname: 'nickname',
      reset_day: 1,
      user_id: 1,
      current_month: 1,
    }));
  });
});
