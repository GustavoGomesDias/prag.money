import AcquisitionController from '../../../../serverless/api/controllers/AcquisitionController';
import { badRequest, HttpResponse } from '../../../../serverless/api/helpers/http';
import PayWithDAOImp from '../../../../serverless/DAOImp/payWith/PayWithDAOImp';
import PurchaseDAOImp from '../../../../serverless/DAOImp/purchase/PurchaseDAOImp';
import mockPaymentDAOImp from '../../../mocks/mockPaymentDAOImp';
import mockUserDAOImp from '../../../mocks/mockUserDAOImp';

jest.mock('../../../mocks/mockUserDAOImp');
jest.mock('../../../mocks/mockPaymentDAOImp');

const makeSut = (): AcquisitionController => {
  const payWithtDAOStub = new PayWithDAOImp();
  const purchaseDAOStub = new PurchaseDAOImp();

  const acquisitionControlerStub = new AcquisitionController(mockPaymentDAOImp, purchaseDAOStub, payWithtDAOStub, mockUserDAOImp);

  return acquisitionControlerStub;
};

describe('Get acquisitions tests', () => {
  test('Should return 400 if id is invalid', async () => {
    const paymentId = -1;

    const acquisitionController = makeSut();
    const httpResponse: HttpResponse = await acquisitionController.handleGetAcquisitionsByPaymentId(paymentId);
    expect(httpResponse).toEqual(badRequest('ID inválido.'));
  });
});
