/* eslint-disable no-return-await */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { validationPage } from '../api/helpers/validations';

export interface PageIsValidFields {
  argPosition: number
}

const PageIsValid = ({
  argPosition,
}: PageIsValidFields) => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any) {
    validationPage(args[argPosition]);
    return await originalMethod.apply(this, args);
  };

  return descriptor;
};

export default PageIsValid;
