/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../../serverless/api/helpers/http';
import withProtect from '../../../../serverless/api/middlewares/withProtect';
import makeUserController from '../../../../serverless/factories/users/UserFacotory';

async function handleGetUserById(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>,
) {
  const id = req.query.id as unknown as number;
  const userController = makeUserController();

  const response = await userController.handleGetPaymentsByUserId(Number(id));

  if (response.error) {
    const { error } = response;
    console.log(error);
    return res.status(response.statusCode).json({ error });
  }

  const { content } = response;
  return res.status(response.statusCode).json({ content });
}

export default withProtect(handleGetUserById);
