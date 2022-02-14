import { NextApiRequest, NextApiResponse } from 'next';
import { HttpResponse } from '../../../serverless/api/helpers/http';
import LoginProps from '../../../serverless/data/usecases/Login';
import { makeUserController } from '../../../serverless/factories/users/UserFacotory';

export default async function handlerLogin(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>
) {

  const { email, password } = req.body as LoginProps;
  const userController = makeUserController();

  const response = await userController.handleLogin({ email, password });

  if (response.error) {
    const { error } = response;
    return res.status(response.statusCode).json({ error });
  }

  const { payload, userInfo } = response;
  return res.status(response.statusCode).json({ payload, userInfo });
}
