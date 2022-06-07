/* eslint-disable camelcase */
/* PaymentDAO tests extendededs */
import PaymentDAOImp from '../../../../serverless/DAOImp/payment/PaymentDAOImp';
import mockGetAcquisitions from '../../../mocks/mockGetAcquisitions';

const makeSut = (): PaymentDAOImp => {
  const paymentDAOStub = new PaymentDAOImp();
  return paymentDAOStub;
};

beforeEach(() => jest.restoreAllMocks());

describe('Extended PaymentDAO tests for payment account value transactions', () => {
  test('Should call hasMonthBalance through setMonthBalance', async () => {
    const spy = jest.spyOn(PaymentDAOImp.prototype, 'hasMonthBalance').mockImplementationOnce(jest.fn());
    const paymentDAOStub = makeSut();

    await paymentDAOStub.setMonthBalance(mockGetAcquisitions);
    expect(spy).toHaveBeenCalled();
  });

  test('Should call resolveHasMonthBalance through setMonthBalance', async () => {
    const spy = jest.spyOn(PaymentDAOImp.prototype, 'resolveHasMonthBalance').mockImplementationOnce(jest.fn());
    const paymentDAOStub = makeSut();

    await paymentDAOStub.setMonthBalance([mockGetAcquisitions]);
    expect(spy).toHaveBeenCalled();
  });

  test('Should call hasMonthBalance for three times', async () => {
    const spy = jest.spyOn(PaymentDAOImp.prototype, 'hasMonthBalance').mockImplementation(jest.fn());
    const paymentDAOStub = makeSut();

    await paymentDAOStub.resolveHasMonthBalance([mockGetAcquisitions, mockGetAcquisitions, mockGetAcquisitions]);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  test('Should call updateAccountValueWithBalance in month account reset day', async () => {
    jest.spyOn(PaymentDAOImp.prototype, 'getDayAndMonth').mockImplementationOnce(() => ({
      day: 3,
      month: 6,
    }));

    const spy = jest.spyOn(PaymentDAOImp.prototype, 'updateAccountValueWithBalance').mockImplementation(jest.fn());

    const paymentDAOStub = makeSut();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { reset_day, current_month, ...rest } = mockGetAcquisitions;
    await paymentDAOStub.hasMonthBalance({
      ...rest,
      current_month: 5,
      reset_day: 1,
    });

    expect(spy).toHaveBeenCalled();
  });

  test('Should not call updateAccountValueWithBalance in any day', async () => {
    jest.spyOn(PaymentDAOImp.prototype, 'getDayAndMonth').mockImplementationOnce(() => ({
      day: 3,
      month: 6,
    }));

    const spy = jest.spyOn(PaymentDAOImp.prototype, 'updateAccountValueWithBalance').mockImplementationOnce(jest.fn());

    const paymentDAOStub = makeSut();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { reset_day, current_month, ...rest } = mockGetAcquisitions;
    await paymentDAOStub.hasMonthBalance({
      ...rest,
      current_month: 7,
      reset_day: 1,
    });

    expect(spy).not.toHaveBeenCalled();
  });

  test('Should ensure that getDayAndMonth return correct value', () => {
    const date = new Date(1654284219226);

    const paymentDAOStub = makeSut();

    const result = paymentDAOStub.getDayAndMonth(date);
    expect(result).toEqual({
      day: 3,
      month: 6,
    });
  });

  test('Should ensure that updateAccountValueWithBalance has been called with correct contract', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => 1654284219226);
    const spy = jest.spyOn(PaymentDAOImp.prototype, 'update').mockImplementation(jest.fn());

    const paymentDAOStub = makeSut();

    await paymentDAOStub.updateAccountValueWithBalance(mockGetAcquisitions);

    expect(spy).toBeCalledWith({
      where: {
        id: mockGetAcquisitions.id,
      },

      data: {
        current_month: 6,
        current_value: {
          increment: mockGetAcquisitions.default_value,
        },
      },
    });
  });
});
