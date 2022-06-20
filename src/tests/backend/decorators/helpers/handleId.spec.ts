import * as validations from '../../../../serverless/api/helpers/Validations';
import handleId from '../../../../serverless/decorators/helpers/handleId';

describe('HandleID Helper Tests', () => {
  test('Should call validationId for three times', () => {
    const spy = jest.spyOn(validations, 'validationId').mockImplementation(jest.fn());
    const ids = [{
      id1: 1,
      id2: 2,
      id3: 3,
    }];
    const fieldIdIsValid = ['id1', 'id2', 'id3'];

    handleId(fieldIdIsValid, undefined, 'ids', ids);

    expect(spy).toBeCalledTimes(3);
  });

  test('Should call validationId for three times if paramName is undefined', () => {
    const spy = jest.spyOn(validations, 'validationId').mockImplementation(jest.fn());
    const ids = {
      id1: 1,
      id2: 2,
      id3: 3,
    };

    const fieldIdIsValid = ['id1', 'id2', 'id3'];

    handleId(fieldIdIsValid, undefined, undefined, ids);

    expect(spy).toBeCalledTimes(3);
  });

  test('Should not call validationId if paramName and idPosition is undefined', () => {
    const spy = jest.spyOn(validations, 'validationId').mockImplementation(jest.fn());
    const ids = {
      id1: 1,
      id2: 2,
      id3: 3,
    };

    handleId(undefined, undefined, undefined, ids);

    expect(spy).not.toHaveBeenCalled();
  });

  test('Should call validationId if paramName is undefined and fieldIdIsValid not is array', () => {
    const spy = jest.spyOn(validations, 'validationId').mockImplementation(jest.fn());
    const ids = {
      id1: 1,
      id2: 2,
      id3: 3,
    };

    const fieldIdIsValid = 'id1';

    handleId(fieldIdIsValid, undefined, undefined, ids);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('Should call validationId if paramName is undefined and fieldIdIsValid is array', () => {
    const spy = jest.spyOn(validations, 'validationId').mockImplementation(jest.fn());
    const ids = {
      id1: 1,
      id2: 2,
      id3: 3,
    };

    const fieldIdIsValid = ['id1', 'id2'];

    handleId(fieldIdIsValid, undefined, undefined, ids);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('Should call validationId if arg is object array', () => {
    const spy = jest.spyOn(validations, 'validationId').mockImplementation(jest.fn());
    const ids = [{
      id1: 1,
      id2: 2,
      id3: 3,
    }];

    handleId(undefined, 1, 'id1', ids);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
