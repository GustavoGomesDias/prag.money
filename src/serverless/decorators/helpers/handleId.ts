import { validationId } from '../../api/helpers/Validations';

/* eslint-disable @typescript-eslint/no-explicit-any */
const handleId = (fieldIdIsValid: string | string[], paramName: string | undefined, args: any) => {
  if (paramName) {
    if (Array.isArray(fieldIdIsValid)) {
      for (const id of fieldIdIsValid) {
        validationId(args[0][id]);
      }
    } else {
      validationId(args[0][fieldIdIsValid]);
    }
  } else if (Array.isArray(fieldIdIsValid)) {
    for (const id of fieldIdIsValid) {
      validationId(args[id]);
    }
  } else {
    validationId(args[fieldIdIsValid]);
  }
};

export default handleId;
