/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../serverless/api/helpers/http';
import withProtect from '../../../serverless/api/middlewares/withProtect';
import makeAcquisition from '../../../serverless/factories/purchase/AcquisitionFactory';
import { NextApiUserRequest } from '../purchase/[id]';

async function handleGetAcquisitonsById(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>,
) {
  const id = req.body.id as unknown as number;
  const page = req.body.page as unknown as number;
  const acquisitionController = makeAcquisition();

  const response = await acquisitionController.handleGetAcquisitionsByPaymentIdWithPagination(Number(id), Number(page), (req as NextApiUserRequest).user.id as number);

  if (response.error) {
    const { error } = response;
    return res.status(response.statusCode).json({ error });
  }

  const { content } = response;
  return res.status(response.statusCode).json({ content });
}

export default withProtect(handleGetAcquisitonsById);
