/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
import AcquisitionController from '../../../../serverless/api/controllers/AcquisitionController';
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';
import PayWithDAOImp from '../../../../serverless/DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../../../serverless/DAOImp/purchase/PurchaseDAOImp';
import PurchaseModel from '../../../../serverless/data/models/PurchaseModel';
import { AddPayment } from '../../../../serverless/data/usecases/AddPurchase';
import UpdateCurrentValue from '../../../../serverless/data/usecases/UpdateCurrentValue';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';

const makeSut = (): AcquisitionController => {
  const payWithtDAOStub = new PayWithDAOImp();
  const purchaseDAOStub = new PurchaseDAOImp();
  const paymentDAO = new PaymentDAOImp();

  const acquisitionControlerStub = new AcquisitionController(paymentDAO, purchaseDAOStub, payWithtDAOStub, mockUserDAOImp);

  return acquisitionControlerStub;
};

describe('Account Controll Tests', () => {
  const payment: AddPayment[] = [{
    paymentId: 1,
    value: 1,
    payWithId: 1,
  }];

  const purchaseDate = new Date('2022-05-20T18:33:18.189Z');
  const purchase: PurchaseModel = {
    description: 'description',
    purchase_date: purchaseDate,
    user_id: 1,
    value: 1,
  };

  const payWith: UpdateCurrentValue = {
    PayWith: [{
      payment_id: 1,
      value: 1,
    }],
  };

  test('Shoud ensure PaymentDAOImp update function was called with correct contract', async () => {
    const spy = jest.spyOn(PaymentDAOImp.prototype, 'update').mockImplementation(jest.fn());
    jest.spyOn(PayWithDAOImp.prototype, 'add').mockImplementation(jest.fn());

    const acquisitionControlerStub = makeSut();

    const entity = acquisitionControlerStub['payWithDAO']['entity'];

    jest.spyOn(entity, 'create').mockImplementation(jest.fn());

    await acquisitionControlerStub.handleAddPayWithRelations(payment, purchase);

    expect(spy).toHaveBeenCalledWith({
      where: {
        id: 1,
      },

      data: {
        current_value: {
          decrement: 1,
        },
      },
    });
  });

  test('Shoud ensure PaymentDAOImp update function was called with correct contract', async () => {
    jest.spyOn(PaymentDAOImp.prototype, 'update').mockImplementation(jest.fn());
    const spy = jest.spyOn(PayWithDAOImp.prototype, 'add');

    const acquisitionControlerStub = makeSut();

    const entity = acquisitionControlerStub['payWithDAO']['entity'];

    jest.spyOn(entity, 'create').mockImplementation(jest.fn());

    await acquisitionControlerStub.handleAddPayWithRelations(payment, purchase);

    expect(spy).toHaveBeenCalledWith({
      payment_id: payment[0].paymentId,
      purchase_id: purchase.id as number,
      value: payment[0].value,
    });
  });

  test('Should ensure call PurchaseDAO findUnique function with correct contract', async () => {
    const spy = jest.spyOn(PurchaseDAOImp.prototype, 'findUnique').mockResolvedValueOnce(payWith);
    jest.spyOn(PaymentDAOImp.prototype, 'addAdditionValue').mockImplementationOnce(jest.fn());

    const id = 1;

    const acquisitionControlerStub = makeSut();

    const entity = acquisitionControlerStub['payWithDAO']['entity'];

    jest.spyOn(entity, 'create').mockImplementation(jest.fn());

    await acquisitionControlerStub.handleEditCurrentValueInPurchaseDeletation(id);

    expect(spy).toHaveBeenCalledWith({
      where: {
        id,
      },

      select: {
        PayWith: {
          select: {
            payment_id: true,
            value: true,
          },
        },
      },
    });
  });

  test('Should ensure call PaymentDAOImp addAdditionValue function with correct contract', async () => {
    jest.spyOn(PurchaseDAOImp.prototype, 'findUnique').mockResolvedValueOnce(payWith);
    const spy = jest.spyOn(PaymentDAOImp.prototype, 'addAdditionValue').mockImplementationOnce(jest.fn());

    const id = 1;

    const acquisitionControlerStub = makeSut();

    const entity = acquisitionControlerStub['payWithDAO']['entity'];

    jest.spyOn(entity, 'create').mockImplementation(jest.fn());

    await acquisitionControlerStub.handleEditCurrentValueInPurchaseDeletation(id);

    expect(spy).toHaveBeenCalledWith({ paymentId: payWith.PayWith[0].payment_id, additionalValue: payWith.PayWith[0].value });
  });

  test('Should ensure call addAdditionValue for three times', async () => {
    jest.spyOn(PurchaseDAOImp.prototype, 'findUnique').mockResolvedValueOnce({
      PayWith: [
        payWith.PayWith[0], payWith.PayWith[0], payWith.PayWith[0],
      ],
    });
    const spy = jest.spyOn(PaymentDAOImp.prototype, 'addAdditionValue').mockImplementation(jest.fn());

    const id = 1;

    const acquisitionControlerStub = makeSut();

    const entity = acquisitionControlerStub['payWithDAO']['entity'];

    jest.spyOn(entity, 'create').mockImplementation(jest.fn());

    await acquisitionControlerStub.handleEditCurrentValueInPurchaseDeletation(id);

    expect(spy).toHaveBeenCalledTimes(3);
  });
});
