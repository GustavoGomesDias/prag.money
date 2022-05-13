/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../serverless/api/helpers/http';
import withProtect from '../../../serverless/api/middlewares/withProtect';
import makePaymentController from '../../../serverless/factories/payment/PaymentFactory';

async function handleDeletePayment(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>,
) {
  const id = req.query.id as unknown as number;
  const paymentController = makePaymentController();

  const response = await paymentController.handleDelete(Number(id));

  if (response.error) {
    const { error } = response;
    return res.status(response.statusCode).json({ error });
  }

  const { message } = response;
  return res.status(response.statusCode).json({ message });
}

export default withProtect(handleDeletePayment);
