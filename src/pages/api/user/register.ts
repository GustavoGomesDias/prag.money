// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { makeUserController } from '../../../serverless/factories/users/UserFacotory';

export default async function handlerRegister(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const userController = makeUserController()
  
  const response = await userController.handleRegister(req);
  if (response.error) {
    const { error } = response;
    return res.status(response.statusCode).json(error);
  }
  return res.status(response.statusCode).json(response.message as string);
}
