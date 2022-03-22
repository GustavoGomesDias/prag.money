/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../serverless/api/helpers/http';
import withProtect from '../../../serverless/api/middlewares/withProtect';
import AddPurchase from '../../../serverless/data/usecases/AddPurchase';
import makeAcquisition from '../../../serverless/factories/purchase/PurchaseFactory';

async function handleRegisterPurchase(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>,
) {
  const {
    description, purchase_date, user_id, value, payments,
  } = req.body as AddPurchase;
  const acquisitionController = makeAcquisition();

  const response = await acquisitionController.handleAddPurchase({
    description, purchase_date, user_id, value, payments,
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
