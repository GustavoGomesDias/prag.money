/* eslint-disable no-return-await */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { checkIsEquals } from '../api/helpers/validations';

export interface IsEquals {
  paramName?: string
  firstFieldName: string
  secondFieldName: string
  messageError: string
}

const CheckIsEquals = ({
  paramName, firstFieldName, secondFieldName, messageError,
}: IsEquals) => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any) {
    if (paramName) {
      checkIsEquals(args[0][firstFieldName], args[0][secondFieldName], messageError);
    } else {
      checkIsEquals(args[firstFieldName], args[secondFieldName], messageError);
    }

    return await originalMethod.apply(this, args);
  };

  return descriptor;
};

export default CheckIsEquals;
