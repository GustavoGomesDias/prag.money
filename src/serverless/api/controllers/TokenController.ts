import EncryptAdapter from '../../adapters/services/EncryptAdapter';
import WebTokenAdapter from '../../adapters/services/WebTokenAdapter';
import UserModel from '../../data/models/UserModel';
import LoginProps from '../../data/usecases/Login';
import UserDAOImp from '../../DAOImp/users/UserDAOImp';
import {
  HttpResponse, okWithPayload,
} from '../helpers/http';
import {
  checkIfExists404code,
  checkPasswordIsTheCertainPassword, validationField400code,
} from '../helpers/validations';
import Catch from '../../decorators/Catch';
import PaymentDAOImp from '../../DAOImp/payment/PaymentDAOImp';
import GetAcquisitions from '../../data/usecases/GetAcquisitions';
import IsValid from '../../decorators/IsValid';
import IsEmail from '../../decorators/IsEmail';

export default class TokenController {
  private readonly userDAOImp: UserDAOImp;

  private readonly paymentDAOImp: PaymentDAOImp;

  private readonly webToken: WebTokenAdapter;

  private readonly encrypter: EncryptAdapter;

  constructor(
    userDAOImp: UserDAOImp,
    webToken: WebTokenAdapter,
    encrypter: EncryptAdapter,
    paymentDAOImp: PaymentDAOImp,
  ) {
    this.userDAOImp = userDAOImp;
    this.webToken = webToken;
    this.encrypter = encrypter;
    this.paymentDAOImp = paymentDAOImp;
  }

  async resolveMonthBalance(payments: GetAcquisitions[]) {
    const result = [];
    for (const payment of payments) {
      result.push(this.paymentDAOImp.setMonthBalance(payment));
    }

    await Promise.all(result);
  }

  @Catch()
  @IsValid({
    paramName: 'infos',
    notEmpty: ['email', 'password'],
    messageError: ['E-mail requerido.', 'Senha requerida.'],
  })
  @IsEmail()
  async handleLogin(infos: LoginProps): Promise<HttpResponse> {
    const { email, password } = infos;

    const user = await this.userDAOImp.findByEmail(email);
    checkIfExists404code(user, 'Usuário não existente, considere criar uma conta.');

    await checkPasswordIsTheCertainPassword(password, user.password, this.encrypter);

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

    const { payments } = await this.userDAOImp.getAllForeignInfosByUserId(user.id as number);

    await this.resolveMonthBalance(payments);

    return okWithPayload(payload, userInfo);
  }

  @Catch()
  async handleRecoverUserInfos(token: string): Promise<HttpResponse> {
    validationField400code(token, 'Não foi encontrado nenhum Token.');

    const result = this.webToken.verify(token);

    const user = await this.userDAOImp.findUnique({
      where: {
        id: result.id,
      },
    }) as UserModel;

    checkIfExists404code(user, 'Usuário não existe.');

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
  }
}
