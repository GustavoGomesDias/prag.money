import { Prisma } from '@prisma/client';
import {
  badRequest, forbidden, HttpResponse, notFound, serverError,
} from '../../api/helpers/http';
import {
  BadRequestError, ForbiddenError, InternalServerError, NotFoundError,
} from '../HttpError';
import { TokenExpired } from '../PMoneyErrors';
import uniqueError from './uniqueError';

const handleErrors = (error: Error): HttpResponse => {
  if (error instanceof NotFoundError) {
    return notFound(error);
  }

  if (error instanceof BadRequestError) {
    return badRequest(error);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return badRequest(new BadRequestError(`${uniqueError(error)} já existe, tente novamente.`));
  }

  if (error instanceof TokenExpired) {
    console.log('entrou');
    return badRequest(new BadRequestError(error.message));
  }

  if (error instanceof ForbiddenError) {
    return forbidden(error);
  }

  return serverError(new InternalServerError('Erro no servidor, tente novamente mais tarde.'));
};

export default handleErrors;
