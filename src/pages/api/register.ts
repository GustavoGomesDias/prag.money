// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import UserModel from '../../serverless/data/models/UserModel'

export default function handlerRegister(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  const { email, name, password } = req.body.user as UserModel;
  return res.status(200);
}
