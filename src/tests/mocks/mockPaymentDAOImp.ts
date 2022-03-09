/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import PaymentDAOImp from '../../serverless/DAOImp/payment/PaymentDAOImp';

const mockPaymentDAOImp: PaymentDAOImp = jest.genMockFromModule('../../serverless/DAOImp/payment/PaymentDAOImp');

mockPaymentDAOImp.add = jest.fn(async (infos) => {
  const result = await Promise.resolve({
    nickname: '',
    default_value: 800,
    reset_date: new Date(),
    user_id: 1,
  });

  return result;
});

export default mockPaymentDAOImp;
