import { Prisma } from "@prisma/client";

const uniqueError = (err: Prisma.PrismaClientKnownRequestError): string => {
  const str = err.message.split('Unique constraint failed on the fields: ')[1];
  const fieldName = str.replace("(`", '').replace("`)", '');
  return fieldName.charAt(0).toUpperCase() + fieldName.substring(1);
}

export default uniqueError;