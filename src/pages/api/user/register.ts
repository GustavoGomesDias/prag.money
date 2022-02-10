// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { HttpResponse } from '../../../serverless/api/controllers/User';
import RegisterUser from '../../../serverless/data/usecases/RegisterUser';
import { makeUserController } from '../../../serverless/factories/users/UserFacotory';

export default async function handlerRegister(
  req: NextApiRequest,
  res: NextApiResponse<Partial<HttpResponse>>
) {
  const userController = makeUserController();

  const { name, email, password, passwordConfirmation } = req.body as RegisterUser;
  const user: RegisterUser = {
    name,
    email,
    password,
    passwordConfirmation
  }
  const response = await userController.handleRegister({
    body: {
      user,
    }
  });
  if (response.error) {
    const { error } = response;
    return res.status(response.statusCode).json({ error });
  }

  const message = response.message as string;
  return res.status(response.statusCode).json({ message });
}
