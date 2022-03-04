import { Prisma } from '@prisma/client';
import { validateEmail, validationField } from '../../../utils/validations';
import { EmailValidatorAdapter } from '../../adapters/services/EmailValidatorAdapter';
import EncryptAdapter from '../../adapters/services/EncryptAdapter';
import WebTokenAdapter from '../../adapters/services/WebTokenAdapter';
import LoginProps from '../../data/usecases/Login';
import RegisterUser from '../../data/usecases/RegisterUser';
import uniqueError from '../../error/uniqueError';
import UserRepository from '../../repositories/users/UserRepository';
import { badRequest, ok, serverError, HttpRequest, HttpResponse, notFound, created, okWithPayload } from '../helpers/http';

export default class UserController {
  private readonly emailValidator: EmailValidatorAdapter;
  private readonly repository: UserRepository;

  constructor(
    emailValidator: EmailValidatorAdapter,
    repository: UserRepository,
  ) {
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
}