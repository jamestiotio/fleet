import { get, join, pickBy } from 'lodash';

export const entitiesExceptID = (entities, id) => {
  return pickBy(entities, (entity, key) => {
    return String(key) !== String(id);
  });
};

const formatServerErrors = (errors) => {
  if (!errors || !errors.length) {
    return {};
  }

  const result = {};

  errors.forEach((error) => {
    const { name, reason } = error;

    if (result[name]) {
      result[name] = join([result[name], reason], ', ');
    } else {
      result[name] = reason;
    }
  });

  return result;
};

export const formatErrorResponse = (errorResponse) => {
  const errors = get(errorResponse, 'message.errors') || [];

  return formatServerErrors(errors);
};

export default { entitiesExceptID, formatErrorResponse };
