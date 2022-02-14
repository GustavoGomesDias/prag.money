import { validationField } from '../../../utils/validations';
import { EmailValidatorAdapter } from '../../adapters/services/EmailValidatorAdapter';
import EncryptAdapter from '../../adapters/services/EncryptAdapter';
import WebTokenAdapter from '../../adapters/services/WebTokenAdapter';
import LoginProps from '../../data/usecases/Login';
import UserRepository from '../../repositories/users/UserRepository';
import { badRequest, HttpResponse, notFound, okWithPayload, serverError } from '../helpers/http';

export default class TokenController {
  private readonly emailValidator: EmailValidatorAdapter;
  private readonly repository: UserRepository;
  private readonly webToken: WebTokenAdapter;
  private readonly encrypter: EncryptAdapter;

  constructor(
    emailValidator: EmailValidatorAdapter,
    repository: UserRepository,
    webToken: WebTokenAdapter,
    encrypter: EncryptAdapter
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
        return badRequest('E-mail inválido.')
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
}