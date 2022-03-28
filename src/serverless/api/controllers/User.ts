/* eslint-disable no-restricted-syntax */
/* eslint-disable eqeqeq */
import { Prisma } from '@prisma/client';
import { EmailValidatorAdapter } from '../../adapters/services/EmailValidatorAdapter';
import RegisterUser from '../../data/usecases/RegisterUser';
import uniqueError from '../../error/uniqueError';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';

import {
  badRequest, serverError, HttpRequest, HttpResponse, created, okWithContent,
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

  handleValidateUserFields(userInfos: RegisterUser): HttpResponse | undefined {
    const {
      email, password, passwordConfirmation,
    } = userInfos;

    const lst: string[] = ['name', 'email', 'password', 'passwordConfirmation'];

    for (const field of lst) {
      let response = '';
      if (field === 'name') response = 'Nome';
      if (field === 'email') response = 'E-mail';
      if (field == 'password') response = 'Senha';
      if (field == 'passwordConfirmation') response = 'Confirmação de senha';

      if (!userInfos[field as keyof RegisterUser]) {
        return badRequest(`${response} requerido (a).`);
      }
    }

    if (!this.emailValidator.isEmail(email)) {
      return badRequest('E-mail inválido.');
    }

    if (password !== passwordConfirmation) {
      return badRequest('Senha diferente de confirmar senha.');
    }

    return undefined;
  }

  async handleRegister(req: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        email, password, name,
      } = req.body.user as RegisterUser;

      const validateUserFields = this.handleValidateUserFields(req.body.user as RegisterUser);

      if (validateUserFields !== undefined) {
        return validateUserFields;
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

      const { id, email, name } = await this.userDAO.findUnique({
        where: {
          id: Number(userId),
        },
      }) as Omit<UserModel, 'password'>;

      return okWithContent({ id, email, name });
    } catch (err) {
      console.log(err);
      return serverError('Erro no servidor, tente novamente mais tarde.');
    }
  }

  async handleGetPaymentsByUserId(userId: number): Promise<HttpResponse> {
    try {
      if (Number.isNaN(userId) || userId === undefined || userId === null || userId < 0) {
        return badRequest('Id de usuário inválido.');
      }

      // TODO: Colocar uma validação para ver se o usuário existe.

      const infos = await this.userDAO.getAllForeignInfosByUserId(userId);

      if (infos === undefined) {
        return badRequest('Não a formas de pagamento cadastradas.');
      }

      const { payments } = infos;

      if (payments.length === 0 || payments[0] === undefined) {
        return badRequest('Não a formas de pagamento cadastradas.');
      }

      return okWithContent({ payments });
    } catch (err) {
      console.log(err);
      return serverError('Erro no servidor, tente novamente mais tarde.');
    }
  }
}
