/* eslint-disable no-restricted-syntax */
/* eslint-disable eqeqeq */
import { EmailValidatorAdapter } from '../../adapters/services/EmailValidatorAdapter';
import RegisterUser from '../../data/usecases/RegisterUser';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';

import {
  HttpRequest, HttpResponse, created, okWithContent, ok,
} from '../helpers/http';
import UserModel from '../../data/models/UserModel';
import {
  checkIfExists404code,
  checkIsEquals, validationEmailRequest, validationField400code, validationId,
} from '../helpers/Validations';
import handleErrors from '../../error/helpers/handleErrors';
import GetForeignInfos from '../../data/usecases/GetForeignInfos';

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
      validationId(userId);

      const user = await this.userDAO.findUnique({
        where: {
          id: Number(userId),
        },
      }) as Omit<UserModel, 'password'>;

      checkIfExists404code(user, 'Usuário não existe.');

      const { id, email, name } = user;

      return okWithContent({ id, email, name });
    } catch (err) {
      console.log(err);
      return handleErrors(err as Error);
    }
  }

  async handleGetPaymentsByUserId(userId: number): Promise<HttpResponse> {
    try {
      validationId(userId);

      const infos = await this.userDAO.getAllForeignInfosByUserId(userId);

      const { payments } = infos as GetForeignInfos;

      checkIfExists404code(payments[0], 'Não há formas de pagamento cadastradas.');

      return okWithContent({ payments });
    } catch (err) {
      console.log(err);
      return handleErrors(err as Error);
    }
  }

  async handleDelete(userId: number): Promise<HttpResponse> {
    try {
      validationId(userId);

      await this.userDAO.delete({
        where: {
          id: userId,
        },
      });

      return ok('Deletado com sucesso!');
    } catch (err) {
      console.log(err);
      return handleErrors(err as Error);
    }
  }
}
