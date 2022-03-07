import { TokenExpiredError } from 'jsonwebtoken';
import { validationField } from '../../../utils/validations';
import { EmailValidatorAdapter } from '../../adapters/services/EmailValidatorAdapter';
import EncryptAdapter from '../../adapters/services/EncryptAdapter';
import WebTokenAdapter from '../../adapters/services/WebTokenAdapter';
import UserModel from '../../data/models/UserModel';
import LoginProps from '../../data/usecases/Login';
import UserRepository from '../../repositories/users/UserRepository';
import {
  badRequest, HttpResponse, notFound, okWithPayload, serverError,
} from '../helpers/http';

export default class TokenController {
  private readonly emailValidator: EmailValidatorAdapter;

  private readonly repository: UserRepository;

  private readonly webToken: WebTokenAdapter;

  private readonly encrypter: EncryptAdapter;

  constructor(
    emailValidator: EmailValidatorAdapter,
    repository: UserRepository,
    webToken: WebTokenAdapter,
    encrypter: EncryptAdapter,
  ) {
    this.emailValidator = emailValidator;
    this.repository = repository;
    this.webToken = webToken;
    this.encrypter = encrypter;
  }

  async handleLogin(infos: LoginProps): Promise<HttpResponse> {
    try {
      const { email, password } = infos;
      if (validationField(email)) {
        return badRequest('E-mail requerido (a).');
      }
      if (validationField(password)) {
        return badRequest('Senha requerido (a).');
      }

      const user = await this.repository.findByEmail(email);
      if (!user || user === undefined) {
        return notFound('Usuário não existente, considere criar uma conta.');
      }

      if (!(await this.encrypter.compare(password, user.password))) {
        return badRequest('Senha incorreta.');
      }

      if (!this.emailValidator.isEmail(email)) {
        return badRequest('E-mail inválido.');
      }

      const payload = this.webToken.sign({
        id: user.id,
        email: user.email,
        name: user.name,
      }, '2d');

      const userInfo = {
        name: user.name,
        email: user.email,
      };

      return okWithPayload(payload, userInfo);
    } catch (err) {
      console.log(err);
      return serverError('Erro no servidor, tente novamente mais tarde');
    }
  }

  async handleRecoverUserInfos(token: string): Promise<HttpResponse> {
    try {
      if (validationField(token)) {
        return badRequest('Não foi encontrado nenhum Token.');
      }

      const result = this.webToken.verify(token);

      const user = await this.repository.findById({
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
