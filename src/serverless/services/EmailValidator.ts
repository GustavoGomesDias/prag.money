import { validateEmail } from '../../utils/validations';
import { EmailValidatorAdapter } from '../adapters/services/EmailValidatorAdapter';

export default class EmailValidator implements EmailValidatorAdapter {
  isEmail(email: string) {
    return validateEmail(email);
  }
}
