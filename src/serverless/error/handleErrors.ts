import { Prisma } from '@prisma/client';
import {
  badRequest, HttpResponse, notFound, unauthorized,
} from '../api/helpers/http';
import { BadRequestError, NotFoundError, UnauthorizedError } from './HttpError';
import uniqueError from './uniqueError';

const handleErrors = (error: Error): HttpResponse | undefined => {
  if (error instanceof NotFoundError) {
    return notFound(error);
  }

  if (error instanceof BadRequestError) {
    return badRequest(error);
  }

  if (error instanceof UnauthorizedError) {
    return unauthorized(error);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return badRequest(new BadRequestError(`${uniqueError(error)} já existe, tente novamente.`));
  }

  return undefined;
};

export default handleErrors;
