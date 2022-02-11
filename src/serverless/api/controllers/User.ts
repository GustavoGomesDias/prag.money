import { EmailValidatorAdapter } from '../../adapters/services/EmailValidatorAdapter';
import LoginProps from '../../data/usecases/Login';
import RegisterUser from '../../data/usecases/RegisterUser';
import UserRepository from '../../repositories/users/UserRepository';
import { badRequest, ok, serverError, HttpRequest, HttpResponse, notFound } from '../helpers/http';

export default class UserController {
  private readonly emailValidator: EmailValidatorAdapter;
  private readonly repository: UserRepository;

  constructor(emailValidator: EmailValidatorAdapter, repository: UserRepository) {
    this.emailValidator = emailValidator;
    this.repository = repository;
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

      return ok('Usuário criado com sucesso!');

    } catch (err) {
      console.log(err);
      return serverError('Erro no servidor, tente novamente mais tarde');
    }
  }

  async handleLogin(infos: LoginProps): Promise<HttpResponse> {
    try {
      const { email, password } = infos;
      if (!email || email === '' || email === ' ') {
        return badRequest('E-mail requerido (a).');
      }
      if (!password || password === '' || password === ' ') {
        return badRequest('Senha requerido (a).');
      }

      const user = await this.repository.findByEmail(email);
      if (!user || user === undefined) {
        return notFound('Usuário não existente, considere criar uma conta.');
      }

      if (user.password !== password) {
        return badRequest('Senha incorreta.');
      }
      return ok('Login efetuado com sucesso!');
    } catch (err) {
      console.log(err);
      return serverError('Erro no servidor, tente novamente mais tarde');
    }
  }
}