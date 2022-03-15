/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../serverless/api/helpers/http';
import withProtect from '../../../serverless/api/middlewares/withProtect';
import AddPurchase from '../../../serverless/data/usecases/AddPurchase';
import makePurchase from '../../../serverless/factories/purchase/PurchaseFactory';

async function handleRegisterPurchase(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>,
) {
  const {
    description, purchase_date, user_id, value, paymentId,
  } = req.body as AddPurchase;
  const purchaseDAO = makePurchase();

  const response = await purchaseDAO.handleAddPurchase({
    description, purchase_date, user_id, value, paymentId,
  });

  if (response.error) {
    const { error } = response;
    console.log(error);
    return res.status(response.statusCode).json({ error });
  }

  const { message } = response;
  return res.status(response.statusCode).json({ message });
}

export default withProtect(handleRegisterPurchase);
