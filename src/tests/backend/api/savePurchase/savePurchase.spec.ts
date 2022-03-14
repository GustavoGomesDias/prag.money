/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import SavePurchaseController from '../../../../serverless/api/controllers/SavePurchaseController';
import { badRequest, HttpResponse } from '../../../../serverless/api/helpers/http';
import AddPurchase from '../../../../serverless/data/usecases/AddPurchase';
import PayWithDAOImp from '../../../../serverless/DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../../../serverless/DAOImp/purchase/PurchaseDAOImp';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';
import mockPaymentDAOImp from '../../../mocks/mockPaymentDAOImp';

jest.mock('../../../mocks/mockUserDAOImp');
jest.mock('../../../mocks/mockPaymentDAOImp');

const makeSut = (): SavePurchaseController => {
  const payWithtDAOStub = new PayWithDAOImp();
  const purchaseDAOStub = new PurchaseDAOImp();

  const savePurchaseControllerStub = new SavePurchaseController(mockPaymentDAOImp, purchaseDAOStub, payWithtDAOStub, mockUserDAOImp);

  return savePurchaseControllerStub;
};

describe('Save Purchase controller tests', () => {
  test('Should return 400 if no description is provided', async () => {
    const infos: AddPurchase = {
      description: '',
      purchase_date: '2022-1-1',
      value: 50,
      user_id: 1,
      paymentId: 1,
    };
    const userController = makeSut();

    const httpResponse: HttpResponse = await userController.handleAddPurchase(infos);

    expect(httpResponse).toEqual(badRequest('Descrição ou data de compra inválidas.'));
  });
});
