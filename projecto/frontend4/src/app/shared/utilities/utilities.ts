import { lensProp, view, set } from 'ramda';

/**
 * Capitalize the first character of a string or
 * capitalize the first character of all string props
 * in an object
 */
export function capitalize(param: {} | string) {
  let acc;
  if (typeof param === 'string') {
    return param.charAt(0).toUpperCase() + param.slice(1);
  } else if (typeof param === 'object') {
    Object.keys(param)
      .map(key => {
        if (typeof param[key] !== 'string') {
          acc = { ...acc, ...{ [key]: param[key] } };
          return acc;
        } else {
          acc = { ...acc, ...{ [key]: param[key].charAt(0).toUpperCase() + param[key].slice(1) } };
          return acc;
        }
      });
  } else {
    acc = param;
  }
  return acc;
}

/**
 * Sort an array by the ID prop of its objects
 */
export function sortByID(list: any[]) {
  return list.sort((a, b) => (a.id > b.id) ? 1 : -1);
}

/**
 * Retuns an Object with the selected JSON props (objPropName) parsed
 */
export function deserialize<T>(obj: T, objPropName: string) {
  const lens = lensProp(objPropName);
  if (typeof view(lens, obj) === 'string') {
    return set(lens, JSON.parse(view(lens, obj)), obj);
  }
  return obj;
}
