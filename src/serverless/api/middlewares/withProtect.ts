import { NextApiRequest, NextApiResponse } from 'next';
import { promisify } from 'util';
import UserModel from '../../data/models/UserModel';
import UserRepository from '../../repositories/users/UserRepository';
import BcryptService from '../../services/BcryptService';

import JWTService from '../../services/JWTService';
import { HttpResponse } from '../helpers/http';

export interface GetUserAuthInfoRequest extends NextApiRequest {
  user: Omit<UserModel, 'password'> // or any other type
}

export type HandlerFunction = (req: NextApiRequest, res: NextApiResponse<Partial<HttpResponse>>) => Promise<void>;

const withProtect = (handler: HandlerFunction) => async (req: GetUserAuthInfoRequest, res: NextApiResponse) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Por favor, faça login para ter acesso!' });
  }

  try {
    const jwtService = new JWTService();
    const verify = promisify(jwtService.verify);

    const decoded = await verify(authorization.split(' ')[1]) as Omit<UserModel, 'password'>;
    const bcryptService = new BcryptService();
    const repository = new UserRepository(bcryptService);
    const user = await repository.findById({
      where: {
        id: decoded.id,
      },
    }) as Omit<UserModel, 'password'>;

    if (!user) {
      return res.status(401).json({ error: 'Usuário cadastrado neste Token aparenta não existir.' });
    }

    req.user = user;

    return handler(req, res);
  } catch (err) {
    console.log(err);

    return res.status(500).json({ error: 'Erro no servidor, tente novamente mais tarde!' });
  }
};

export default withProtect;
