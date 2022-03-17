/* eslint-disable no-restricted-syntax */
/* eslint-disable eqeqeq */
import { Prisma } from '@prisma/client';
import { EmailValidatorAdapter } from '../../adapters/services/EmailValidatorAdapter';
import RegisterUser from '../../data/usecases/RegisterUser';
import uniqueError from '../../error/uniqueError';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';

import {
  badRequest, serverError, HttpRequest, HttpResponse, created, okWithPayload,
} from '../helpers/http';
import UserModel from '../../data/models/UserModel';

export default class UserController {
  private readonly emailValidator: EmailValidatorAdapter;

  private readonly userDAO: UserDAOImp;

  constructor(
    emailValidator: EmailValidatorAdapter,
    userDAO: UserDAOImp,
  ) {
    this.emailValidator = emailValidator;
    this.userDAO = userDAO;
  }

  async handleRegister(req: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        email, name, password, passwordConfirmation,
      } = req.body.user as RegisterUser;

      const lst: string[] = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of lst) {
        let response = '';
        if (field === 'name') response = 'Nome';
        if (field === 'email') response = 'E-mail';
        if (field == 'password') response = 'Senha';
        if (field == 'passwordConfirmation') response = 'Confirmação de senha';

        if (!req.body.user?.[field as keyof RegisterUser]) {
          return badRequest(`${response} requerido (a).`);
        }
      }

      if (!this.emailValidator.isEmail(email)) {
        return badRequest('E-mail inválido.');
      }

      if (password !== passwordConfirmation) {
        return badRequest('Senha diferente de confirmar senha.');
      }

      await this.userDAO.addUser({
        email, name, password,
      });

      return created('Usuário criado com sucesso!');
    } catch (err) {
      console.log(err);
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          return badRequest(`${uniqueError(err)} já existe, tente novamente.`);
        }
      }
      return serverError('Erro no servidor, tente novamente mais tarde');
    }
  }

  async handleGetUserById(userId: number): Promise<HttpResponse> {
    try {
      if (Number.isNaN(userId) || userId === undefined || userId === null || userId < 0) {
        return badRequest('Id de usuário inválido.');
      }

      const { id, email, name } = await this.userDAO.findById({
        where: {
          id: Number(userId),
        },
      }) as Omit<UserModel, 'password'>;

      return okWithPayload('', { id, email, name });
    } catch (err) {
      console.log(err);
      return serverError('Erro no servidor, tente novamente mais tarde.');
    }
  }
}
