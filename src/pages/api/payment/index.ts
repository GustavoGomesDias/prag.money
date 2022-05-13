/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../serverless/api/helpers/http';
import withProtect from '../../../serverless/api/middlewares/withProtect';
import PaymentModel from '../../../serverless/data/models/PaymentModel';
import makePaymentController from '../../../serverless/factories/payment/PaymentFactory';

async function handleRegisterPayment(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>,
) {
  const {
    nickname, default_value, reset_day, user_id,
  } = req.body as PaymentModel;
  const controller = makePaymentController();

  const response = await controller.handleAdd({
    nickname, default_value, reset_day, user_id,
  });

  if (response.error) {
    const { error } = response;
    return res.status(response.statusCode).json({ error });
  }

  const { message } = response;
  return res.status(response.statusCode).json({ message });
}

export default withProtect(handleRegisterPayment);
