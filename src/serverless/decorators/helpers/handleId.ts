/* eslint-disable no-lonely-if */
import { validationId } from '../../api/helpers/validations';

/* eslint-disable @typescript-eslint/no-explicit-any */
const handleId = (fieldIdIsValid: string | string[] | undefined, idPosition: number | undefined, paramName: string | undefined, args: any) => {
  if (paramName && fieldIdIsValid !== undefined) {
    if (Array.isArray(fieldIdIsValid)) {
      for (const id of fieldIdIsValid) {
        validationId(args[0][id]);
      }
    } else {
      validationId(args[0][fieldIdIsValid]);
    }
  } else {
    if (Array.isArray(fieldIdIsValid)) {
      for (const id of fieldIdIsValid) {
        validationId(args[id]);
      }
    } else {
      if (fieldIdIsValid) validationId(args[fieldIdIsValid]);
    }
  }

  if (idPosition !== undefined) {
    if (paramName) {
      validationId(args[0][idPosition]);
    } else {
      validationId(args[idPosition]);
    }
  }
};

export default handleId;
