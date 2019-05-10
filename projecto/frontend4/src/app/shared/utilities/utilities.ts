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
