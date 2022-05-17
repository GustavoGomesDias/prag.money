/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AcquisitionController from '../../../../serverless/api/controllers/AcquisitionController';
import {
  badRequest, HttpResponse, notFound, ok, serverError,
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

const makeSut = (): AcquisitionController => {
  const payWithtDAOStub = new PayWithDAOImp();
  const purchaseDAOStub = new PurchaseDAOImp();
  const paymentDAO = new PaymentDAOImp();

  const acquisitionControlerStub = new AcquisitionController(paymentDAO, purchaseDAOStub, payWithtDAOStub, mockUserDAOImp);

  return acquisitionControlerStub;
};

describe('Delete Acquisitions tests', () => {
  test('Should return 400 if id is invalid', async () => {
    const paymentId = -1;

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleDeleteAcquisitionsByPaymentId(paymentId);
    expect(httpResponse).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 404 if payment not exists', async () => {
    const paymentId = 1;

    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(async (infos) => {
      await Promise.reject(new NotFoundError('Forma de pagamento não cadastrada.'));
    });

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleDeleteAcquisitionsByPaymentId(paymentId);
    expect(httpResponse).toEqual(notFound(new NotFoundError('Forma de pagamento não cadastrada.')));
  });

  test('Should return 500 if any error occurs', async () => {
    const paymentId = 1;

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(async (infos) => {
      throw new Error('Error');
    });

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleDeleteAcquisitionsByPaymentId(paymentId);
    expect(httpResponse).toEqual(
      serverError(new InternalServerError('Erro no servidor, tente novamente mais tarde.')),
    );
  });

  test('Should return 200 and acquisitions informations', async () => {
    const paymentId = 1;
    const date = new Date();

    jest.spyOn(PaymentDAOImp.prototype, 'findByPaymentId').mockImplementationOnce(async (infos) => {
      const result: ReturnsAcquisitions = await Promise.resolve({ ...mockReturnsAcquisiton });
      return result;
    });

    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(jest.fn());

    jest.spyOn(PurchaseDAOImp.prototype, 'deletePurchasesByAcquisisitionList').mockImplementationOnce(jest.fn());

    const acquisitionController = makeSut();

    const httpResponse: HttpResponse = await acquisitionController.handleDeleteAcquisitionsByPaymentId(paymentId);

    expect(httpResponse).toEqual(ok('Gastos/Compras deletas com sucesso!'));
  });

  test('Should return 400 if invalid user id is provided', async () => {
    const controllerStub = makeSut();
    // eslint-disable-next-line prefer-destructuring
    const entity = new PurchaseDAOImp()['entity'];
    jest.spyOn(entity, 'delete').mockImplementationOnce(jest.fn());

    const result = await controllerStub.handleDeleteAcquisitionByPurchaseId(-1, 1);

    expect(result).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if user ids not equals', async () => {
    const controllerStub = makeSut();
    // eslint-disable-next-line prefer-destructuring
    const entity = new PurchaseDAOImp()['entity'];

    jest.spyOn(entity, 'delete').mockImplementationOnce(jest.fn());

    jest.spyOn(PurchaseDAOImp.prototype, 'checkIfPurchaseExists').mockImplementationOnce(async (info) => {
      const result = await Promise.resolve({
        id: 2,
        value: 12,
        description: 'Almoção',
        purchase_date: new Date('2022-05-09T00:00:00.000Z'),
        created_at: new Date('2022-05-09T19:47:10.524Z'),
        updated_at: new Date('2022-05-09T19:47:10.526Z'),
        user_id: 2,
      });

      return result;
    });

    const result = await controllerStub.handleDeleteAcquisitionByPurchaseId(1, 1);

    expect(result).toEqual(badRequest(new BadRequestError('Você não tem permissão para excluir.')));
  });

  test('Should return 200 if payment is deleted', async () => {
    // eslint-disable-next-line prefer-destructuring
    const entity = new PurchaseDAOImp()['entity'];
    jest.spyOn(entity, 'delete').mockImplementationOnce(jest.fn());
    jest.spyOn(PurchaseDAOImp.prototype, 'checkIfPurchaseExists').mockImplementationOnce(async (info) => {
      const result = await Promise.resolve({
        id: 2,
        value: 12,
        description: 'Almoção',
        purchase_date: new Date('2022-05-09T00:00:00.000Z'),
        created_at: new Date('2022-05-09T19:47:10.524Z'),
        updated_at: new Date('2022-05-09T19:47:10.526Z'),
        user_id: 1,
      });

      return result;
    });
    jest.spyOn(validations, 'checkIsEquals').mockImplementationOnce(jest.fn());

    const controllerStub = makeSut();
    const result = await controllerStub.handleDeleteAcquisitionByPurchaseId(1, 1);

    expect(result).toEqual(ok('Gasto/Compra deleta com sucesso!'));
  });
});
