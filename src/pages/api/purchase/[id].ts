/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../serverless/api/helpers/http';
import withProtect from '../../../serverless/api/middlewares/withProtect';
import UserModel from '../../../serverless/data/models/UserModel';
import AuthRequired from '../../../serverless/data/usecases/AuthRequired';
import UpdatePurchase from '../../../serverless/data/usecases/UpdatePurchase';
import makeAcquisition from '../../../serverless/factories/purchase/AcquisitionFactory';
import makePurchase from '../../../serverless/factories/purchase/PurchaseFactory';

export interface NextApiUserRequest extends NextApiRequest {
  user: UserModel
}

async function handle(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>,
) {
  const purchaseId = req.query.id as unknown as number;

  const acquisitionController = makeAcquisition();
  const purchaseController = makePurchase();

  if (req.method === 'DELETE') {
    const response = await acquisitionController.handleDeleteAcquisitionByPurchaseId(Number(purchaseId), (req as AuthRequired).user.id as number);

    if (response.error) {
      const { error } = response;
      return res.status(response.statusCode).json({ error });
    }

    const { message } = response;
    return res.status(response.statusCode).json({ message });
  }

  if (req.method === 'PUT') {
    const {
      id, description, purchase_date, user_id, value, payments, payWithDeleteds,
    } = req.body as UpdatePurchase;
    const response = await acquisitionController.handleUpdatePurchase({
      id, description, purchase_date, user_id, value, payments, payWithDeleteds,
    }, (req as AuthRequired).user.id as number);

    if (response.error) {
      const { error } = response;
      return res.status(response.statusCode).json({ error });
    }

    const { message } = response;
    return res.status(response.statusCode).json({ message });
  }

  const response = await purchaseController.handleGetPurchaseById(Number(purchaseId), (req as AuthRequired).user.id as number);

  if (response.error) {
    const { error } = response;
    return res.status(response.statusCode).json({ error });
  }

  const { content } = response;
  return res.status(response.statusCode).json({ content });
}

export default withProtect(handle);
// export default handle;
