import EncryptAdapter from '../../adapters/services/EncryptAdapter';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../error/HttpError';

export const validationId = (id: number) => {
  if (!(typeof id === 'number') || Number.isNaN(id) || id < 0) {
    throw new BadRequestError('ID inválido.');
  }
};

export const validationPage = (page: number) => {
  if (Number.isNaN(page) || page < 0) {
    throw new BadRequestError('Página inválida.');
  }
};

export const validationField400code = (info: unknown, message: string) => {
  if (!info || info === undefined || info === null || info === '' || info === ' ') {
    throw new BadRequestError(message);
  }
};

export const checkIfExists404code = (info: unknown, message: string) => {
  if (!info || info === undefined || info === null || info === '' || info === ' ' || (Array.isArray(info) && info.length < 1)) {
    throw new NotFoundError(message);
  }
};

export const validationValues = (value: number, message: string) => {
  if (value < 0) {
    throw new BadRequestError(message);
  }
};

export const checkPasswordIsTheCertainPassword = async (password: string, userPassword: string, encrypter: EncryptAdapter) => {
  if (!(await encrypter.compare(password, userPassword))) {
    throw new BadRequestError('E-mail ou senhas incorretos.');
  }
};

export const validationEmailRequest = (isValid: boolean) => {
  if (!isValid) {
    throw new BadRequestError('E-mail inválido.');
  }
};

export const checkIsEquals = (firstTestValue: unknown, secondTestValue: unknown, errorMessage: string) => {
  if (firstTestValue !== secondTestValue) {
    throw new BadRequestError(errorMessage);
  }
};

export const checkIsEquals403Error = (firstTestValue: unknown, secondTestValue: unknown, errorMessage: string) => {
  if (firstTestValue !== secondTestValue) {
    throw new ForbiddenError(errorMessage);
  }
};
