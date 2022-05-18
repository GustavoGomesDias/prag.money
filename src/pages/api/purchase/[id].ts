/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../serverless/api/helpers/http';
import withProtect from '../../../serverless/api/middlewares/withProtect';
import UserModel from '../../../serverless/data/models/UserModel';
import makeAcquisition from '../../../serverless/factories/purchase/AcquisitionFactory';
import makePurchase from '../../../serverless/factories/purchase/PurchaseFactory';

export interface NextApiUserRequest extends NextApiRequest {
  user: UserModel
}

async function handle(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>,
) {
  const id = req.query.id as unknown as number;

  const acquisitionController = makeAcquisition();
  const purchaseController = makePurchase();

  if (req.method === 'DELETE') {
    const response = await acquisitionController.handleDeleteAcquisitionByPurchaseId(Number(id), (req as NextApiUserRequest).user.id as number);

    if (response.error) {
      const { error } = response;
      return res.status(response.statusCode).json({ error });
    }

    const { message } = response;
    return res.status(response.statusCode).json({ message });
  }

  const response = await purchaseController.handleGetPurchaseById(Number(id), (req as NextApiUserRequest).user.id as number);

  if (response.error) {
    const { error } = response;
    return res.status(response.statusCode).json({ error });
  }

  const { content } = response;
  return res.status(response.statusCode).json({ content });
}

export default withProtect(handle);
// export default handle;
