/* eslint-disable no-return-await */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { validationDay } from '../../utils/validations';
import { BadRequestError } from '../error/HttpError';

export interface IsDayOfTheMonthProps {
  paramName?: string
  fieldName: string
}

const IsDayOfTheMonth = ({ fieldName, paramName }: IsDayOfTheMonthProps) => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any) {
    console.log(args[0][fieldName]);
    if (paramName) {
      console.log('Entrou');
      if (!validationDay(args[0][fieldName])) {
        throw new BadRequestError('Por favor, forneça um dia que seja valido.');
      }
    } else if (!validationDay(args[fieldName])) {
      throw new BadRequestError('Por favor, forneça um dia que seja valido.');
    }
    return await originalMethod.apply(this, args);
  };

  return descriptor;
};

export default IsDayOfTheMonth;
