import { TokenExpiredError } from 'jsonwebtoken';
import { validationField } from '../../../utils/validations';
import { EmailValidatorAdapter } from '../../adapters/services/EmailValidatorAdapter';
import EncryptAdapter from '../../adapters/services/EncryptAdapter';
import WebTokenAdapter from '../../adapters/services/WebTokenAdapter';
import UserModel from '../../data/models/UserModel';
import LoginProps from '../../data/usecases/Login';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';
import {
  badRequest, HttpResponse, notFound, okWithPayload, serverError,
} from '../helpers/http';
import {
  checkIfExists, checkPasswordIsTheCertainPassword, validationEmailRequest, validationFieldRequest,
} from '../helpers/Validations';
import handleErrors from '../../error/handleErrors';
import { InternalServerError } from '../../error/HttpError';

export default class TokenController {
  private readonly emailValidator: EmailValidatorAdapter;

  private readonly userDAOImp: UserDAOImp;

  private readonly webToken: WebTokenAdapter;

  private readonly encrypter: EncryptAdapter;

  constructor(
    emailValidator: EmailValidatorAdapter,
    userDAOImp: UserDAOImp,
    webToken: WebTokenAdapter,
    encrypter: EncryptAdapter,
  ) {
    this.emailValidator = emailValidator;
    this.userDAOImp = userDAOImp;
    this.webToken = webToken;
    this.encrypter = encrypter;
  }

  validationLoginInfos(infos: LoginProps): void {
    const { email, password } = infos;

    validationFieldRequest(email, 'E-mail requerido.');
    validationFieldRequest(password, 'Senha requerida.');
  }

  async handleLogin(infos: LoginProps): Promise<HttpResponse> {
    try {
      const { email, password } = infos;
      this.validationLoginInfos(infos);

      const user = await this.userDAOImp.findByEmail(email);

      await checkPasswordIsTheCertainPassword(password, user.password, this.encrypter);

      const validationEmail = this.emailValidator.isEmail(email);
      validationEmailRequest(validationEmail);

      const payload = this.webToken.sign({
        id: user.id,
        email: user.email,
        name: user.name,
      }, '2d');

      const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      return okWithPayload(payload, userInfo);
    } catch (err) {
      console.log(err);
      const error = handleErrors(err as Error);
      if (error !== undefined) {
        return error;
      }
      return serverError(new InternalServerError('Erro no servidor, tente novamente mais tarde.'));
    }
  }

  async handleRecoverUserInfos(token: string): Promise<HttpResponse> {
    try {
      if (validationField(token)) {
        return badRequest('Não foi encontrado nenhum Token.');
      }

      const result = this.webToken.verify(token);

      const user = await this.userDAOImp.findUnique({
        where: {
          id: result.id,
        },
      }) as UserModel;

      if (!user || user === undefined || user === null) {
        return notFound('Usuário não existe.');
      }

      const newToken = this.webToken.sign({
        id: user.id,
        email: user.email as string,
        name: user.name as string,
      }, '2d');

      return okWithPayload(newToken, {
        id: user.id,
        email: user.email as string,
        name: user.name as string,
      });
    } catch (err: unknown | Error | TokenExpiredError) {
      if (err instanceof TokenExpiredError) {
        return badRequest('Token expirado.');
      }
      console.log(err);
      return serverError('Erro no servidor, tente novamente mais tarde');
    }
  }
}
