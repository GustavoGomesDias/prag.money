/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../serverless/api/helpers/http';
import withProtect from '../../../serverless/api/middlewares/withProtect';
import AuthRequired from '../../../serverless/data/usecases/AuthRequired';
import makeAcquisition from '../../../serverless/factories/purchase/AcquisitionFactory';

async function handleGetAcquisitonsByIdWithPagination(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>,
) {
  const id = req.body.id as unknown as number;
  const page = req.body.page as unknown as number;
  const acquisitionController = makeAcquisition();

  const response = await acquisitionController.handleGetAcquisitionsByPaymentIdWithPagination(Number(id), Number(page), (req as AuthRequired).user.id as number);

  if (response.error) {
    const { error } = response;
    return res.status(response.statusCode).json({ error });
  }

  const { content } = response;
  return res.status(response.statusCode).json({ content });
}

export default withProtect(handleGetAcquisitonsByIdWithPagination);
