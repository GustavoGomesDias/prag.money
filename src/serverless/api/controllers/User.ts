/* eslint-disable no-restricted-syntax */
/* eslint-disable eqeqeq */
import { EmailValidatorAdapter } from '../../adapters/services/EmailValidatorAdapter';
import RegisterUser from '../../data/usecases/RegisterUser';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';

import {
  HttpResponse, created, okWithContent, ok,
} from '../helpers/http';
import UserModel from '../../data/models/UserModel';
import {
  checkIfExists404code,
  validationId,
} from '../helpers/validations';
import GetForeignInfos from '../../data/usecases/GetForeignInfos';
import Catch from '../../decorators/Catch';
import IsValid from '../../decorators/IsValid';
import IsEmail from '../../decorators/IsEmail';
import CheckIsEquals from '../../decorators/CheckIsEquals';

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

  @Catch()
  @IsValid({
    notEmpty: ['name', 'email', 'password', 'passwordConfirmation'],
    paramName: 'req',
    messageError: [
      'Nome de usuário requerido.',
      'E-mail requerido.',
      'Senha requerida.',
      'Confirmação de senha requerida.',
    ],
  })
  @IsEmail()
  @CheckIsEquals({
    paramName: 'req',
    firstFieldName: 'password',
    secondFieldName: 'passwordConfirmation',
    messageError: 'Senha diferente de confirmar senha.',
  })
  async handleRegister(infos: RegisterUser): Promise<HttpResponse> {
    const {
      email, password, name,
    } = infos;

    await this.userDAO.addUser({
      email, name, password,
    });

    return created('Usuário criado com sucesso!');
  }

  @Catch()
  async handleGetUserById(userId: number): Promise<HttpResponse> {
    validationId(userId);

    const user = await this.userDAO.findUnique({
      where: {
        id: Number(userId),
      },
    }) as Omit<UserModel, 'password'>;

    checkIfExists404code(user, 'Usuário não existe.');

    const { id, email, name } = user;
    return okWithContent({ id, email, name });
  }

  @Catch()
  async handleGetPaymentsByUserId(userId: number): Promise<HttpResponse> {
    validationId(userId);

    const infos = await this.userDAO.getAllForeignInfosByUserId(userId);

    const { payments } = infos as GetForeignInfos;

    checkIfExists404code(payments[0], 'Não há formas de pagamento cadastradas.');

    return okWithContent({ payments });
  }

  @Catch()
  async handleDelete(userId: number): Promise<HttpResponse> {
    validationId(userId);

    await this.userDAO.delete({
      where: {
        id: userId,
      },
    });

    return ok('Deletado com sucesso!');
  }
}
