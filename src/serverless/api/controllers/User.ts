import { validateEmail, validationField } from '../../../utils/validations';
import { EmailValidatorAdapter } from '../../adapters/services/EmailValidatorAdapter';
import EncryptAdapter from '../../adapters/services/EncryptAdapter';
import WebTokenAdapter from '../../adapters/services/WebTokenAdapter';
import LoginProps from '../../data/usecases/Login';
import RegisterUser from '../../data/usecases/RegisterUser';
import UserRepository from '../../repositories/users/UserRepository';
import { badRequest, ok, serverError, HttpRequest, HttpResponse, notFound, created, okWithPayload } from '../helpers/http';

export default class UserController {
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

  async handleRegister(req: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, name, password, passwordConfirmation } = req.body.user as RegisterUser;

      const lst: string[] = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of lst) {
        let response;
        if (field === 'name') response = 'Nome';
        if (field === 'email') response = 'E-mail';
        if (field == 'password') response = 'Senha';
        if (field == 'passwordConfirmation') response = 'Confirmação de senha';

        if (!req.body.user?.[field as keyof RegisterUser]) {
          return badRequest(`${response} requerido (a).`);
        }
      }

      if (!this.emailValidator.isEmail(email)) {
        return badRequest('E-mail inválido.');;
      }

      if (password !== passwordConfirmation) {
        return badRequest('Senha diferente de confirmar senha.');
      }

      await this.repository.addUser({
        email, name, password,
      });

      return created('Usuário criado com sucesso!');

    } catch (err) {
      console.log(err);
      return serverError('Erro no servidor, tente novamente mais tarde');
    }
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
        email: user.email,
        name: user.name,
      }, '2d');

      return okWithPayload(payload);

    } catch (err) {
      console.log(err);
      return serverError('Erro no servidor, tente novamente mais tarde');
    }
  }
}