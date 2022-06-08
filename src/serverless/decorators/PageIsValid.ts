/* eslint-disable no-return-await */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { validationPage } from '../api/helpers/Validations';

export interface PageIsValidFields {
  paramName?: string
  fieldName: string
}

const PageIsValid = ({
  paramName, fieldName,
}: PageIsValidFields) => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any) {
    if (paramName) {
      validationPage(args[0][fieldName]);
    } else {
      validationPage(args[fieldName]);
    }

    return await originalMethod.apply(this, args);
  };

  return descriptor;
};

export default PageIsValid;
