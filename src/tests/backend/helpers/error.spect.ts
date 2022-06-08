import { Prisma } from '@prisma/client';
import { badRequest, forbidden } from '../../../serverless/api/helpers/http';
import handleErrors from '../../../serverless/error/helpers/handleErrors';
import uniqueError from '../../../serverless/error/helpers/uniqueError';
import { BadRequestError, ForbiddenError } from '../../../serverless/error/HttpError';
import { TokenExpired } from '../../../serverless/error/PMoneyErrors';

const mockFunction = (err: Error) => {
  throw err;
};

describe('Handle Error tests', () => {
  test('Should throw a BadRequestError for PrismaClientKnownRequestError', () => {
    try {
      mockFunction(new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (teste)', 'POO2', '1'));
    } catch (err) {
      const result = handleErrors(err as Error);
      expect(result).toEqual(badRequest(new BadRequestError(`${uniqueError(new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (teste)', 'POO2', '1'))} já existe, tente novamente.`)));
    }
  });

  test('Should throw a BadRequestError for TokenExpired error', () => {
    try {
      mockFunction(new TokenExpired());
    } catch (err) {
      const result = handleErrors(err as Error);
      expect(result).toEqual(badRequest(new BadRequestError((err as Error).message)));
    }
  });

  test('Should throw a ForbiddenError for ForbiddenError', () => {
    try {
      mockFunction(new ForbiddenError('teste'));
    } catch (err) {
      const result = handleErrors(err as Error);
      expect(result).toEqual(forbidden(new ForbiddenError('teste')));
    }
  });
});
