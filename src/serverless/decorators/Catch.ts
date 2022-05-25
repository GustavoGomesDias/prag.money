/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import handleErrors from '../error/helpers/handleErrors';

const Catch = () => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (err) {
      console.log(err);
      return handleErrors(err as Error);
    }
  };

  return descriptor;
};

export default Catch;
