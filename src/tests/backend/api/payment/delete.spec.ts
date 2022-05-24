/* eslint-disable dot-notation */
import PaymentController from '../../../../serverless/api/controllers/PaymentController';
import { badRequest, ok } from '../../../../serverless/api/helpers/http';
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';
import { BadRequestError } from '../../../../serverless/error/HttpError';

const makeSut = (): PaymentController => {
  const daoIMP = new PaymentDAOImp();
  const controllerStub = new PaymentController(daoIMP);
  return controllerStub;
};

describe('Handle Payment Delete', () => {
  test('Should return 400 if invalid user id is provided', async () => {
    const controllerStub = makeSut();
    // eslint-disable-next-line prefer-destructuring
    const entity = new PaymentDAOImp()['entity'];
    jest.spyOn(entity, 'delete').mockImplementationOnce(jest.fn());

    const result = await controllerStub.handleDelete(-1);

    expect(result).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if user id is string', async () => {
    const controllerStub = makeSut();
    // eslint-disable-next-line prefer-destructuring
    const entity = new PaymentDAOImp()['entity'];
    jest.spyOn(entity, 'delete').mockImplementationOnce(jest.fn());

    const result = await controllerStub.handleDelete('-1' as unknown as number);

    expect(result).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 400 if user id is string and converted to number', async () => {
    const controllerStub = makeSut();
    // eslint-disable-next-line prefer-destructuring
    const entity = new PaymentDAOImp()['entity'];
    jest.spyOn(entity, 'delete').mockImplementationOnce(jest.fn());

    const result = await controllerStub.handleDelete(Number('aa'));

    expect(result).toEqual(badRequest(new BadRequestError('ID inválido.')));
  });

  test('Should return 200 if payment is deleted', async () => {
    // eslint-disable-next-line prefer-destructuring
    const entity = new PaymentDAOImp()['entity'];
    jest.spyOn(entity, 'delete').mockImplementationOnce(jest.fn());

    const controllerStub = makeSut();
    const result = await controllerStub.handleDelete(1);

    expect(result).toEqual(ok('Forma de pagamento deletada com sucesso!'));
  });
});
