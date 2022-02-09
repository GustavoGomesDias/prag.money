import { EmailValidatorAdapter } from '../../adapters/services/EmailValidatorAdapter';
import EncryptAdapter from '../../adapters/services/EncryptAdapter';
import RegisterUser from '../../data/usecases/RegisterUser';
import UserRepository from '../../repositories/UserRepository';

export interface HttpResponse {
  message?: string
  error?: string
  statusCode: number
}

export interface HttpRequest {
  body: {
    user?: RegisterUser
  }
}

export default class UserController {
  private readonly emailValidator: EmailValidatorAdapter;
  private readonly repository: UserRepository;
  private readonly encrypter: EncryptAdapter;

  constructor(emailValidator: EmailValidatorAdapter, encrypter: EncryptAdapter) {
    this.emailValidator = emailValidator;
    this.repository = new UserRepository();
    this.encrypter =  encrypter;
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
          const res: HttpResponse = {
            statusCode: 400,
            message: `${response} requerido (a).`,
          }
          return res;
        }
      }

      if (!this.emailValidator.isEmail(email)) {
        const res: HttpResponse = {
          statusCode: 400,
          message: 'E-mail inválido.',
        }
        return res;
      }

      if (password !== passwordConfirmation) {
        const res: HttpResponse = {
          statusCode: 400,
          message: 'Senha diferente de confirmar senha.',
        }
        return res;
      }

      const hash = await this.encrypter.encrypt(password);
      await this.repository.add({
        email, name, password: hash,
      });

      const res: HttpResponse = {
        statusCode: 200,
        message: 'Usuário criado com sucesso!',
      }
      return res;
    } catch (err) {
      console.log(err);
      const res: HttpResponse = {
        statusCode: 500,
        message: 'Erro no servidor, tente novamente mais tarde',
      }
      return res;
    }
  }
}