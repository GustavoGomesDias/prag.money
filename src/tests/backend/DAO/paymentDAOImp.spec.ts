import PaymentDAOImp from '../../../serverless/DAOImp/payment/PaymentDAOImp';
import prisma from '../../../serverless/data/prisma/config';

const makeSut = (): PaymentDAOImp => {
  const paymentDAOStub = new PaymentDAOImp();
  return paymentDAOStub;
};

describe('Payment DAO Implementation tests', () => {
  test('Should call constructor with prisma.payment', () => {
    const paymentDAOStub = makeSut();

    // eslint-disable-next-line dot-notation
    expect(paymentDAOStub['entity']).toEqual(prisma.payment);
  });

  test('Should call checkIfUserExistis if correct user', async () => {
    const req = 1;
    const paymentDAOImpStub = makeSut();

    const spy = jest.spyOn(paymentDAOImpStub, 'checkIfPaymentExists');
    await paymentDAOImpStub.checkIfPaymentExists(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should checkIfUserExistis returns false if user not exists', async () => {
    const req = 1;
    const userDAOImpStub = makeSut();

    jest.spyOn(GenericDAOImp.prototype, 'findById').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve(undefined);

      return result;
    });
    const response = await userDAOImpStub.checkIfUserExists(req);

    expect(response).toBeFalsy();
  });

  test('Should checkIfUserExistis returns true if user exists', async () => {
    const req = 1;
    const userDAOImpStub = makeSut();

    jest.spyOn(GenericDAOImp.prototype, 'findById').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve({
        id: 1,
        name: 'name',
        email: 'email@email.com',
      });

      return result;
    });
    const response = await userDAOImpStub.checkIfUserExists(req);

    expect(response).toBeTruthy();
  });
});
