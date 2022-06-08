/* eslint-disable no-return-await */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { validationEmailRequest } from '../api/helpers/Validations';
import EmailValidator from '../services/EmailValidator';

const IsEmail = () => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any) {
    const emailValidator = new EmailValidator();
    let validationEmail = true;
    if (Array.isArray(args)) {
      validationEmail = emailValidator.isEmail(args[0].email);
    } else {
      validationEmail = emailValidator.isEmail(args.email);
    }

    validationEmailRequest(validationEmail);
    return await originalMethod.apply(this, args);
  };

  return descriptor;
};

export default IsEmail;
