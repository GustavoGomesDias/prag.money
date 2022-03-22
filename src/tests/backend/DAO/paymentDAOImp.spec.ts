/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import PaymentDAOImp from '../../../serverless/DAOImp/payment/PaymentDAOImp';
import prisma from '../../../serverless/data/prisma/config';
import GenericDAOImp from '../../../serverless/infra/DAO/GenericDAOImp';

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

    jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve(undefined);

      return result;
    });
    const response = await userDAOImpStub.checkIfPaymentExists(req);

    expect(response).toBeFalsy();
  });

  test('Should checkIfUserExistis returns true if user exists', async () => {
    const req = 1;
    const userDAOImpStub = makeSut();

    jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve({
        id: 1,
        nickname: 'nick',
        default_value: 800,
        reset_day: 1,
        user_id: 1,
      });

      return result;
    });
    const response = await userDAOImpStub.checkIfPaymentExists(req);

    expect(response).toBeTruthy();
  });
});
