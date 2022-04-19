/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import PaymentDAOImp from '../../../serverless/DAOImp/payment/PaymentDAOImp';
import prisma from '../../../serverless/data/prisma/config';
import GenericDAOImp from '../../../serverless/infra/DAO/GenericDAOImp';
import mockReturnsAcquisitionsUseCase from '../../mocks/acquisitons/mockReturnsAcquisitionsUseCase';

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

  test('Should call findByPaymentId if correct paymentId', async () => {
    const req = 1;
    const paymentDAOImpStub = makeSut();

    const spy = jest.spyOn(paymentDAOImpStub, 'findByPaymentId').mockImplementationOnce(jest.fn());
    await paymentDAOImpStub.findByPaymentId(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should findByPaymentId returns correct acquisition infos', async () => {
    const req = 1;
    const paymentDAOImpStub = makeSut();

    jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve({
        PayWith: {
          payment_id: 1,
          purchase_id: 1,
          value: 1,
        },
        default_value: 800,
        nickname: 'nickname',
        reset_day: 1,
        user_id: 1,
      });

      return result;
    });
    const acquisition = await paymentDAOImpStub.findByPaymentId(req);

    expect(acquisition).toEqual({ ...mockReturnsAcquisitionsUseCase });
  });

  test('Should call checkIfPaymentExists if correct paymentId', async () => {
    const req = 1;
    const paymentDAOImpStub = makeSut();

    const spy = jest.spyOn(paymentDAOImpStub, 'checkIfPaymentExists').mockImplementationOnce(jest.fn());
    await paymentDAOImpStub.checkIfPaymentExists(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should ensure that checkIfPaymentExists throws an error if the user does not exist', async () => {
    try {
      const req = 1;
      const userDAOImpStub = makeSut();

      jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
        const result = await Promise.resolve(undefined);

        return result;
      });
      await userDAOImpStub.checkIfPaymentExists(req);
    } catch (err) {
      expect((err as Error).message).toBe('Forma de pagamento não cadastrada.');
    }
  });
});
