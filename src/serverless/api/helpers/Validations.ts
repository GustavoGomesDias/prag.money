import { BadRequestError, NotFoundError } from '../../error/HttpError';

export const validationId = (id: number) => {
  if (Number.isNaN(id) || id < 0) {
    throw new BadRequestError('ID inválido.');
  }
};

export const validationFieldRequest = (info: unknown, message: string) => {
  if (!info || info === undefined || info === null || info === '' || info === ' ') {
    throw new BadRequestError(message);
  }
};

export const checkIfExists = (info: unknown, message: string) => {
  if (!info || info === undefined || info === null || info === '' || info === ' ') {
    throw new NotFoundError(message);
  }
};

export const validationExpenseValue = (value: number, message: string) => {
  if (value < 0) {
    throw new BadRequestError(message);
  }
};
