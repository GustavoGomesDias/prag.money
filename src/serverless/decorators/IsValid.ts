/* eslint-disable dot-notation */
/* eslint-disable no-return-await */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { validationField400code, validationValues } from '../api/helpers/Validations';
import handleId from './helpers/handleId';

export interface IsValidFields {
  paramName?: string
  fieldIdIsValid?: string | string[]
  idPosition?: number // for no object fields
  notEmpty?: string[]
  validationValueMsg?: string
  messageError?: string[]
}

const IsValid = ({
  notEmpty, fieldIdIsValid, paramName, validationValueMsg, messageError, idPosition,
}: IsValidFields) => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any) {
    if (fieldIdIsValid) {
      handleId(fieldIdIsValid, idPosition, paramName, args);
    }

    if (idPosition !== undefined) {
      handleId(fieldIdIsValid, idPosition, paramName, args);
    }

    if (notEmpty && notEmpty.length > 0) {
      let messagePos = 0;
      for (const items of notEmpty) {
        console.log(args[0][items]);
        const message = messageError ? messageError[messagePos] : 'Todos que tem * é um item obrigatório e deve ser preenchido.';

        validationField400code(args[0][items], message);

        if (typeof args[0][items] === 'number') {
          validationValues(args[0][items] as number, validationValueMsg || 'Valor precisa ser um número e maior/igual que zero.');
        }
        messagePos++;
      }
    }

    return await originalMethod.apply(this, args);
  };

  return descriptor;
};

export default IsValid;
