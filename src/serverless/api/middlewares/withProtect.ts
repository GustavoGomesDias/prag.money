import { NextApiRequest, NextApiResponse } from 'next';
// import { promisify } from 'util';
import { JsonWebTokenError } from 'jsonwebtoken';
import UserModel from '../../data/models/UserModel';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';
import BcryptService from '../../services/BcryptService';

import JWTService from '../../services/JWTService';
import { HttpResponse } from '../helpers/http';
import { TokenExpired } from '../../error/PMoneyErrors';
import FinancialHelper from '../../services/FinancialHelper';

export interface GetUserAuthInfoRequest extends NextApiRequest {
  user: Omit<UserModel, 'password'> // or any other type
}

export type HandlerFunction = (req: NextApiRequest, res: NextApiResponse<Partial<HttpResponse>>) => Promise<void>;

const withProtect = (handler: HandlerFunction) => async (req: GetUserAuthInfoRequest, res: NextApiResponse) => {
  if (req.headers?.authorization === undefined) {
    return res.status(401).json({ error: 'Por favor, faça login para ter acesso!' });
  }

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Por favor, faça login para ter acesso!' });
  }

  try {
    const jwtService = new JWTService();

    const decoded = jwtService.verify(authorization.split(' ')[1]) as Omit<UserModel, 'password'>;
    const bcryptService = new BcryptService();
    const financialHelper = new FinancialHelper();
    const userDAO = new UserDAOImp(bcryptService, financialHelper);
    const user = await userDAO.findUnique({
      where: {
        id: decoded.id,
      },
    }) as Omit<UserModel, 'password'>;

    if (!user) {
      return res.status(404).json({ error: 'Usuário cadastrado neste Token aparenta não existir.' });
    }

    req.user = user;

    return await handler(req, res);
  } catch (err) {
    console.log(err);
    if (err instanceof JsonWebTokenError) {
      return res.status(401).json({ error: 'Token inválido.' });
    }

    if (err instanceof TokenExpired) {
      return res.status(401).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Erro no servidor, tente novamente mais tarde!' });
  }
};

export default withProtect;
