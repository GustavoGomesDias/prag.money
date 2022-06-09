/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import AcquisitionController from '../../../../serverless/api/controllers/AcquisitionController';
import {
  badRequest, HttpResponse, notFound, ok, serverError,
} from '../../../../serverless/api/helpers/http';
import PayWithDAOImp from '../../../../serverless/DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../../../serverless/DAOImp/purchase/PurchaseDAOImp';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';
import { BadRequestError, InternalServerError, NotFoundError } from '../../../../serverless/error/HttpError';
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';
import UpdatePurchase from '../../../../serverless/data/usecases/UpdatePurchase';
import GenericDAOImp from '../../../../serverless/infra/DAO/GenericDAOImp';
import AddPurchase, { AddPayment } from '../../../../serverless/data/usecases/AddPurchase';

jest.mock('../../../mocks/mockUserDAOImp');
jest.mock('../../../mocks/mockPaymentDAOImp');

const makeSut = (): AcquisitionController => {
  const payWithtDAOStub = new PayWithDAOImp();
  const purchaseDAOStub = new PurchaseDAOImp();
  const paymentDAO = new PaymentDAOImp();

  const acquisitionControlerStub = new AcquisitionController(paymentDAO, purchaseDAOStub, payWithtDAOStub, mockUserDAOImp);

  return acquisitionControlerStub;
};

afterAll(() => jest.restoreAllMocks());

describe('Update acquisition tests', () => {
  test('Should return 400 if no description is provided', async () => {
    const infos: UpdatePurchase = {
      description: '',
      purchase_date: new Date('2021-1-1'),
      value: 50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
      payWithDeleteds: [],
    };
    const acquisitionControler = makeSut();

    const httpResponse: HttpResponse = await acquisitionControler.handleUpdatePurchase(infos, 1);

    expect(httpResponse).toEqual(badRequest(new BadRequestError('Descrição é requerido.')));
  });

  test('Should return 400 if value is invalid', async () => {
    const infos: UpdatePurchase = {
      description: 'descripion',
      purchase_date: new Date('2021-1-1'),
      value: -50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
      payWithDeleteds: [],
    };
    const acquisitionControler = makeSut();

    const httpResponse: HttpResponse = await acquisitionControler.handleUpdatePurchase(infos, 1);

    expect(httpResponse).toEqual(badRequest(new BadRequestError('Valor do gasto tem que ser maior que zero.')));
  });

  test('Should return 400 if user not exists', async () => {
    const infos: UpdatePurchase = {
      description: 'descripion',
      purchase_date: new Date('2021-1-1'),
      value: 50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
      payWithDeleteds: [],
    };

    jest.spyOn(mockUserDAOImp, 'checkIfUserExists').mockImplementationOnce(async (infos) => {
      await Promise.reject(new NotFoundError('Usuário não existe.'));
    });
    const acquisitionControler = makeSut();

    const httpResponse: HttpResponse = await acquisitionControler.handleUpdatePurchase(infos, 1);

    expect(httpResponse).toEqual(notFound(new NotFoundError('Usuário não existe.')));
  });

  test('Should return 400 if payment not exists', async () => {
    const infos: UpdatePurchase = {
      description: 'descripion',
      purchase_date: new Date('2021-1-1'),
      value: 50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
      payWithDeleteds: [],
    };

    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(async (infos) => {
      await Promise.reject(new NotFoundError('Forma de pagamento não existe.'));
    });
    const acquisitionControler = makeSut();

    const httpResponse: HttpResponse = await acquisitionControler.handleUpdatePurchase(infos, 1);

    expect(httpResponse).toEqual(notFound(new NotFoundError('Forma de pagamento não existe.')));
  });

  test('Should return 500 if server returns a error', async () => {
    const infos: UpdatePurchase = {
      description: 'descripion',
      purchase_date: new Date('2021-1-1'),
      value: 50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
      payWithDeleteds: [],
    };

    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(jest.fn());
    jest.spyOn(PurchaseDAOImp.prototype, 'update').mockImplementationOnce(async () => {
      throw new Error('Server Error');
    });
    const acquisitionControler = makeSut();

    const response = await acquisitionControler.handleUpdatePurchase(infos, 1);

    expect(response).toEqual(serverError(new InternalServerError('Erro no servidor, tente novamente mais tarde.')));
  });

  test('Should return 200 if purchase is updated', async () => {
    const infos: UpdatePurchase = {
      description: 'descripion',
      purchase_date: new Date('2021-1-1'),
      value: 50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
      payWithDeleteds: [],
    };
    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(jest.fn());

    jest.spyOn(PurchaseDAOImp.prototype, 'update').mockImplementationOnce(jest.fn());
    jest.spyOn(AcquisitionController.prototype, 'handleUpdatePayWithRelations').mockImplementationOnce(jest.fn());
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleUpdatePurchase(infos, 1);

    expect(httpResponse).toEqual(ok('Compra atualizada com sucesso!'));
  });

  test('Should call handleUpdatePayWithRelations', async () => {
    const infos: UpdatePurchase = {
      description: 'descripion',
      purchase_date: new Date('2021-1-1'),
      value: 50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
      payWithDeleteds: [],
    };

    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementationOnce(jest.fn());

    jest.spyOn(PurchaseDAOImp.prototype, 'update').mockImplementationOnce(jest.fn());

    const entity = new PayWithDAOImp()['entity'];
    jest.spyOn(entity, 'update').mockImplementationOnce(jest.fn());
    const spy = jest.spyOn(AcquisitionController.prototype, 'handleUpdatePayWithRelations');
    const userController = makeSut();

    await userController.handleUpdatePurchase(infos, 1);

    expect(spy).toHaveBeenCalled();
  });

  test('Should call handleUpdatePayWithRelations with correct value', async () => {
    const infos = [{
      paymentId: 1,
      value: 1,
      payWithId: 1,
    }];

    jest.spyOn(PayWithDAOImp.prototype, 'update').mockImplementation(jest.fn());
    jest.spyOn(PayWithDAOImp.prototype, 'add').mockImplementation(jest.fn());
    const spy = jest.spyOn(AcquisitionController.prototype, 'handleUpdatePayWithRelations');
    const userController = makeSut();

    const entity = userController['payWithDAO']['entity'];

    jest.spyOn(entity, 'create').mockImplementation(jest.fn());

    await userController.handleUpdatePayWithRelations(infos, 1);

    expect(spy).toHaveBeenCalledWith(infos, 1);
  });

  test('Should call handleUpdatePayWithRelations for 3 times', async () => {
    const infos: AddPayment[] = [{
      paymentId: 1,
      value: 1,
      payWithId: 1,
    }];

    jest.spyOn(PayWithDAOImp.prototype, 'update').mockImplementation(async (info) => {
      await Promise.resolve(true);
    });
    jest.spyOn(PayWithDAOImp.prototype, 'add').mockImplementation(jest.fn());
    const spy = jest.spyOn(PayWithDAOImp.prototype, 'update');
    const userController = makeSut();

    const entity = userController['payWithDAO']['entity'];

    jest.spyOn(entity, 'create').mockImplementation(jest.fn());

    await userController.handleUpdatePayWithRelations(infos, 1);

    expect(spy).toBeCalledTimes(1);
  });

  test('Should call handleDeletePayWiths for 3 times', async () => {
    const infos = [1, 2, 3];

    const entity = new PayWithDAOImp()['entity'];
    const spy = jest.spyOn(entity, 'delete').mockImplementation(jest.fn());

    const userController = makeSut();

    await userController.handleDeletePayWiths(infos);

    expect(spy).toBeCalledTimes(3);
  });

  test('Should call handleDeletePayWiths with correct value', async () => {
    const infos = [1, 2, 3];

    const entity = new PayWithDAOImp()['entity'];
    jest.spyOn(PaymentDAOImp.prototype, 'delete').mockImplementationOnce(jest.fn());
    const spy = jest.spyOn(AcquisitionController.prototype, 'handleDeletePayWiths');
    const userController = makeSut();

    await userController.handleDeletePayWiths(infos);

    expect(spy).toHaveBeenCalledWith(infos);
  });

  test('Should call handleDeletePayWiths', async () => {
    const infos: UpdatePurchase = {
      description: 'descripion',
      purchase_date: new Date('2021-1-1'),
      value: 50,
      user_id: 1,
      payments: [{
        paymentId: 1,
        value: 1,
      }],
      payWithDeleteds: [1, 2],
    };

    jest.spyOn(PaymentDAOImp.prototype, 'checkIfPaymentExists').mockImplementation(jest.fn());
    jest.spyOn(PurchaseDAOImp.prototype, 'update').mockImplementation(jest.fn());
    jest.spyOn(PayWithDAOImp.prototype, 'delete').mockImplementation(jest.fn());

    jest.spyOn(PayWithDAOImp.prototype, 'add').mockImplementation(jest.fn());
    const spy = jest.spyOn(AcquisitionController.prototype, 'handleDeletePayWiths');
    const userController = makeSut();

    const entity = userController['payWithDAO']['entity'];
    jest.spyOn(entity, 'update').mockImplementation(jest.fn());

    jest.spyOn(entity, 'create').mockImplementation(jest.fn());

    await userController.handleUpdatePurchase(infos, 1);

    expect(spy).toHaveBeenCalled();
  });
});
