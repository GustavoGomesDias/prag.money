/* eslint-disable no-restricted-syntax */
/* eslint-disable eqeqeq */
import { Prisma } from '@prisma/client';
import { EmailValidatorAdapter } from '../../adapters/services/EmailValidatorAdapter';
import RegisterUser from '../../data/usecases/RegisterUser';
import uniqueError from '../../error/helpers/uniqueError';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';

import {
  badRequest, serverError, HttpRequest, HttpResponse, created, okWithContent,
} from '../helpers/http';
import UserModel from '../../data/models/UserModel';
import { checkIsEquals, validationEmailRequest, validationField400code } from '../helpers/Validations';
import handleErrors from '../../error/helpers/handleErrors';

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

  handleValidateUserFields(userInfos: RegisterUser): void {
    const {
      name, email, password, passwordConfirmation,
    } = userInfos;

    validationField400code(name, 'Nome de usuário requerido.');
    validationField400code(email, 'E-mail requerido.');
    validationField400code(password, 'Senha requerida.');
    validationField400code(passwordConfirmation, 'Confirmação de senha requerida.');

    const validationEmail = this.emailValidator.isEmail(email);
    validationEmailRequest(validationEmail);

    checkIsEquals(password, passwordConfirmation, 'Senha diferente de confirmar senha.');
  }

  async handleRegister(req: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        email, password, name,
      } = req.body.user as RegisterUser;

      this.handleValidateUserFields(req.body.user as RegisterUser);
      await this.userDAO.addUser({
        email, name, password,
      });

      return created('Usuário criado com sucesso!');
    } catch (err) {
      console.log(err);
      return handleErrors(err as Error);
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
