import { NextApiRequest, NextApiResponse } from 'next';
import RegisterUser from '../../data/usecases/RegisterUser';

export interface HttpResponse {
  message?: string
  error?: string
  statusCode: number
}

export interface HttpRequest {
  body: {
    user?: RegisterUser
  }
}

export default class UserController {
  handleRegister(req: HttpRequest): HttpResponse {
    const { email, name, password, passwordConfirmation } = req.body.user as RegisterUser;

    if (!name || name === '' || name === ' ') {
      const res: HttpResponse = {
        statusCode: 400,
        message: 'Nome requerido.',
      }
      return res;
    }
    if (!email || email === '' || email === ' ') {
      const res: HttpResponse = {
        statusCode: 400,
        message: 'E-mail requerido.',
      }
      return res;
    }

    const res: HttpResponse = {
      statusCode: 200,
      message: 'Conta criada com sucesso!',
    }
    return res;
  }
}