/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../serverless/api/helpers/http';
import withProtect from '../../../serverless/api/middlewares/withProtect';
import PaymentModel from '../../../serverless/data/models/PaymentModel';
import AddAdditionalValue from '../../../serverless/data/usecases/AddAdditionalValue';
import AuthRequired from '../../../serverless/data/usecases/AuthRequired';
import makePaymentController from '../../../serverless/factories/payment/PaymentFactory';

async function handleDeletePayment(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>,
) {
  const paymentId = req.query.id as unknown as number;
  const paymentController = makePaymentController();

  if (req.method === 'POST') {
    const infos = req.body.infos as AddAdditionalValue;
    const response = await paymentController.handleAddAdditionalValue(infos, (req as AuthRequired).user.id as number);

    if (response.error) {
      const { error } = response;
      return res.status(response.statusCode).json({ error });
    }

    const { message } = response;
    return res.status(response.statusCode).json({ message });
  }

  if (req.method === 'DELETE') {
    const response = await paymentController.handleDelete(Number(paymentId), (req as AuthRequired).user.id as number);

    if (response.error) {
      const { error } = response;
      return res.status(response.statusCode).json({ error });
    }

    const { message } = response;
    return res.status(response.statusCode).json({ message });
  }

  if (req.method === 'PUT') {
    const {
      id, nickname, default_value, reset_day, user_id, current_month,
    } = req.body as PaymentModel;
    const response = await paymentController.handleEdit({
      id, nickname, default_value, reset_day, user_id, current_month,
    }, (req as AuthRequired).user.id as number);

    if (response.error) {
      const { error } = response;
      return res.status(response.statusCode).json({ error });
    }

    const { message } = response;
    return res.status(response.statusCode).json({ message });
  }

  const response = await paymentController.handleGetPaymentById(Number(paymentId), (req as AuthRequired).user.id as number);

  if (response.error) {
    const { error } = response;
    return res.status(response.statusCode).json({ error });
  }

  const { content } = response;
  return res.status(response.statusCode).json({ content });
}

export default withProtect(handleDeletePayment);
