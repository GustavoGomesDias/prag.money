import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../serverless/api/helpers/http';
import PaymentModel from '../../../serverless/data/models/PaymentModel';
import { makePaymentController } from '../../../serverless/factories/payment/PaymentFactory';

export default async function handlerLogin(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>
) {

  const { nickname, default_value, reset_day, user_id } = req.body as PaymentModel;
  const paymentController = makePaymentController();

  const response = await paymentController.handleAdd({ nickname, default_value, reset_day, user_id });

  if (response.error) {
    const { error } = response;
    console.log(error);
    return res.status(response.statusCode).json({ error });
  }

  const { message } = response;
  return res.status(response.statusCode).json({ message });
}