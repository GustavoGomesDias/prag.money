import UserModel from '../models/UserModel';

type LoginProps = Omit<UserModel, 'name'>;

export default LoginProps;