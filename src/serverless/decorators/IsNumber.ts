/* eslint-disable no-return-await */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { validationValues } from '../api/helpers/validations';

export interface IsNumberFields {
  paramName?: string
  argName?: string
}

const IsNumber = ({
  paramName, argName,
}: IsNumberFields) => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any) {
    if (paramName) {
      if (argName) {
        validationValues(args[0][argName], 'Valor adicional precisa ser um número e maior/igual que zero.');
      }
    }

    return await originalMethod.apply(this, args);
  };

  return descriptor;
};

export default IsNumber;
