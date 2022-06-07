/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';
import PaymentModel from '../../../../serverless/data/models/PaymentModel';
import prisma from '../../../../serverless/data/prisma/config';
import { NotFoundError } from '../../../../serverless/error/HttpError';
import ExtendGenericDAOImp from '../../../../serverless/infra/DAO/ExtendGenericDAOImp';
import GenericDAOImp from '../../../../serverless/infra/DAO/GenericDAOImp';
import mockReturnsAcquisitionsUseCase from '../../../mocks/acquisitons/mockReturnsAcquisitionsUseCase';

const makeSut = (): PaymentDAOImp => {
  const paymentDAOStub = new PaymentDAOImp();
  return paymentDAOStub;
};

afterAll(() => jest.resetAllMocks());

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
        current_month: 1,
      });

      return result;
    });
    const acquisition = await paymentDAOImpStub.findByPaymentId(req);

    expect(acquisition).toEqual({ ...mockReturnsAcquisitionsUseCase });
  });

  test('Should return acquisitions if PayWith is not array (findByPaymentId)', async () => {
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

    expect(Array.isArray(acquisition.acquisitions)).toBeTruthy();
  });

  test('Should return acquisitions if PayWith is array (findByPaymentId)', async () => {
    const req = 1;
    const paymentDAOImpStub = makeSut();

    jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve({
        PayWith: [{
          payment_id: 1,
          purchase_id: 1,
          value: 1,
        }, {
          payment_id: 2,
          purchase_id: 2,
          value: 2,
        }],
        default_value: 800,
        nickname: 'nickname',
        reset_day: 1,
        user_id: 1,
      });

      return result;
    });
    const acquisition = await paymentDAOImpStub.findByPaymentId(req);

    expect(Array.isArray(acquisition.acquisitions)).toBeTruthy();
  });

  test('Should call findByPaymentIdWithPagination if correct paymentId', async () => {
    const paymentDAOImpStub = makeSut();

    const spy = jest.spyOn(paymentDAOImpStub, 'findByPaymentIdWithPagination').mockImplementationOnce(jest.fn());
    await paymentDAOImpStub.findByPaymentIdWithPagination(1, 0);

    expect(spy).toHaveBeenCalledWith(1, 0);
  });

  test('Should findByPaymentIdWithPagination returns correct acquisition infos', async () => {
    const paymentDAOImpStub = makeSut();

    jest.spyOn(ExtendGenericDAOImp.prototype, 'findMany').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve([{
        PayWith: {
          payment_id: 1,
          purchase_id: 1,
          value: 1,
        },
        default_value: 800,
        nickname: 'nickname',
        reset_day: 1,
        user_id: 1,
        current_month: 1,
      }]);

      return result;
    });
    const acquisition = await paymentDAOImpStub.findByPaymentIdWithPagination(1, 0);

    expect(acquisition).toEqual({ ...mockReturnsAcquisitionsUseCase });
  });

  test('Should return acquisitions if PayWith is not array (findByPaymentIdWithPagination)', async () => {
    const paymentDAOImpStub = makeSut();

    jest.spyOn(ExtendGenericDAOImp.prototype, 'findMany').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve([{
        PayWith: {
          payment_id: 1,
          purchase_id: 1,
          value: 1,
        },
        default_value: 800,
        nickname: 'nickname',
        reset_day: 1,
        user_id: 1,
      }]);

      return result;
    });
    const acquisition = await paymentDAOImpStub.findByPaymentIdWithPagination(1, 0);

    expect(Array.isArray(acquisition.acquisitions)).toBeTruthy();
  });

  test('Should return acquisitions if PayWith is array (findByPaymentIdWithPagination)', async () => {
    const paymentDAOImpStub = makeSut();

    jest.spyOn(ExtendGenericDAOImp.prototype, 'findMany').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve([{
        PayWith: [{
          payment_id: 1,
          purchase_id: 1,
          value: 1,
        }, {
          payment_id: 2,
          purchase_id: 2,
          value: 2,
        }],
        default_value: 800,
        nickname: 'nickname',
        reset_day: 1,
        user_id: 1,
      }]);

      return result;
    });
    const acquisition = await paymentDAOImpStub.findByPaymentIdWithPagination(1, 0);

    expect(Array.isArray(acquisition.acquisitions)).toBeTruthy();
  });

  test('Should return 404 status code if findMany returns a empty array', async () => {
    const paymentDAOImpStub = makeSut();

    jest.spyOn(ExtendGenericDAOImp.prototype, 'findMany').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve([]);

      return result;
    });
    await expect(paymentDAOImpStub.findByPaymentIdWithPagination(1, 0)).rejects.toThrow(new NotFoundError('Não há mais gastos/compras cadastrados nessa conta.'));
  });

  test('Should call checkIfPaymentExists if correct paymentId', async () => {
    const req = 1;
    const paymentDAOImpStub = makeSut();

    const spy = jest.spyOn(paymentDAOImpStub, 'checkIfPaymentExists').mockImplementationOnce(jest.fn());
    await paymentDAOImpStub.checkIfPaymentExists(req);

    expect(spy).toHaveBeenCalledWith(req);
  });

  test('Should ensure that checkIfPaymentExists throws an error if the user does not exist', async () => {
    const req = 1;
    const userDAOImpStub = makeSut();

    jest.spyOn(GenericDAOImp.prototype, 'findUnique').mockImplementationOnce(async (infos) => {
      const result = await Promise.resolve(undefined);

      return result;
    });
    await expect(userDAOImpStub.checkIfPaymentExists(req)).rejects.toThrow(new NotFoundError('Forma de pagamento não cadastrada.'));
  });

  test('Should call GenericDAOImp add function with correct value', async () => {
    const paymentRequest: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: 1,
      current_month: 1,
    };

    // eslint-disable-next-line prefer-destructuring
    const entity = new PaymentDAOImp()['entity'];
    const spy = jest.spyOn(entity, 'create').mockImplementationOnce(async () => {
      const result = await Promise.resolve({
        nickname: 'nickname',
        default_value: 800,
        reset_day: 1,
        user_id: 1,
      });

      return result;
    });

    const paymentStub = makeSut();

    await paymentStub.add(paymentRequest);

    expect(spy).toHaveBeenCalledWith({
      data: paymentRequest,
    });
  });

  test('Should call GenericDAOImp update function with correct value', async () => {
    const paymentRequest: PaymentModel = {
      nickname: 'nickname',
      default_value: 800,
      reset_day: 1,
      user_id: 1,
      current_month: 1,
    };

    // eslint-disable-next-line prefer-destructuring
    const entity = new PaymentDAOImp()['entity'];
    const spy = jest.spyOn(entity, 'update').mockImplementation(async () => {
      const result = await Promise.resolve({
        payment_id: 1,
        purchase_id: 1,
        value: 800,
      });

      return result;
    });

    const purchaseStub = new PaymentDAOImp();

    await purchaseStub.update({
      where: {
        id: 1,
      },
      data: paymentRequest,
    });

    expect(spy).toHaveBeenCalledWith({
      data: paymentRequest,
      where: {
        id: 1,
      },
    });
  });

  test('Should call GenericDAOImp findMany function with correct value', async () => {
    // eslint-disable-next-line prefer-destructuring
    const data = {
      take: 6,
      skip: (4 * 0),
      where: {
        id: Number(1),
      },
      select: {
        PayWith: true,
        default_value: true,
        nickname: true,
        reset_day: true,
        user_id: true,
      },
    };
    const entity = new PaymentDAOImp()['entity'];
    const spy = jest.spyOn(entity, 'findMany').mockImplementationOnce(async () => {
      const result = await Promise.resolve({
        payment_id: 1,
        purchase_id: 1,
        value: 800,
      });

      return result;
    });

    const purchaseStub = new PaymentDAOImp();

    await purchaseStub.findMany(data);

    expect(spy).toHaveBeenCalledWith(data);
  });

  test('Should call GenericDAOImp delete function with correct value', async () => {
    // eslint-disable-next-line prefer-destructuring
    const entity = new PaymentDAOImp()['entity'];
    const spy = jest.spyOn(entity, 'delete').mockImplementationOnce(jest.fn());

    const purchaseStub = new PaymentDAOImp();

    await purchaseStub.delete({
      where: {
        id: 1,
      },
    });

    expect(spy).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
  });
});
