import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../serverless/api/helpers/http';
import makeTokenController from '../../../serverless/factories/token/TokenFactory';

export default async function handlerRecoverUserInfos(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>,
) {
  const token = req.body.token as string;
  const tokenController = makeTokenController();

  const response = await tokenController.handleRecoverUserInfos(token);

  if (response.error) {
    const { error } = response;
    return res.status(response.statusCode).json({ error });
  }

  const { payload, userInfo } = response;
  return res.status(response.statusCode).json({ payload, userInfo });
}
