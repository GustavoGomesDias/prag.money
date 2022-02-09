import { NextApiRequest, NextApiResponse } from 'next';
import { EmailValidatorAdapter } from '../../adapters/EmailValidatorAdapter';
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
  private readonly emailValidator: EmailValidatorAdapter;

  constructor(emailValidator: EmailValidatorAdapter) {
    this.emailValidator = emailValidator;
  }

  handleRegister(req: HttpRequest): HttpResponse {
    const { email, name, password, passwordConfirmation } = req.body.user as RegisterUser;

    const lst: string[] = ['name', 'email', 'password', 'passwordConfirmation'];

    for (const field of lst) {
      let response;
      if (field === 'name') response = 'Nome';
      if (field === 'email') response = 'E-mail';
      if (field == 'password') response = 'Senha';
      if (field == 'passwordConfirmation') response = 'Confirmação de senha';

      if (!req.body.user?.[field as keyof RegisterUser]) {
        const res: HttpResponse = {
          statusCode: 400,
          message: `${response} requerido (a).`,
        }
        return res;
      }
    }

    if (!this.emailValidator.isEmail(email)) {
      const res: HttpResponse = {
        statusCode: 400,
        message: 'E-mail inválido.',
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