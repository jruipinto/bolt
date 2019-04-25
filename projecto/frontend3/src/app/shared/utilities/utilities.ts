export const capitalize = (s: string) => {
    if (typeof s !== 'string') {
      return '';
    } else {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
  };
