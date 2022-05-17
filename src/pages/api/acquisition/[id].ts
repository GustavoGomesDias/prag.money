/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../serverless/api/helpers/http';
import withProtect from '../../../serverless/api/middlewares/withProtect';
import makeAcquisition from '../../../serverless/factories/purchase/AcquisitionFactory';

async function handleGetAcquisitonsById(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>,
) {
  const id = req.query.id as unknown as number;
  const acquisitionController = makeAcquisition();

  if (req.method === 'DELETE') {
    const response = await acquisitionController.handleDeleteAcquisitionsByPaymentId(Number(id));

    if (response.error) {
      const { error } = response;
      return res.status(response.statusCode).json({ error });
    }

    const { message } = response;
    return res.status(response.statusCode).json({ message });
  }

  const response = await acquisitionController.handleGetAcquisitionsByPaymentId(Number(id));

  if (response.error) {
    const { error } = response;
    return res.status(response.statusCode).json({ error });
  }

  const { content } = response;
  return res.status(response.statusCode).json({ content });
}

export default withProtect(handleGetAcquisitonsById);
