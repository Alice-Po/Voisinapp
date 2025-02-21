export const formatUsername = (uri) => {
  const url = new URL(uri);
  const username = url.pathname.split("/").slice(-1);
  return `@${username}@${url.host}`;
};

export const arrayOf = (value) => {
  // If the field is null-ish, we suppose there are no values.
  if (value === null || value === undefined) {
    return [];
  }
  // Return as is.
  if (Array.isArray(value)) {
    return value;
  }
  // Single value is made an array.
  return [value];
};

export const colorFromString = (value, offsets = {}) => {
  const colRange = {
    r: { min: 0x60, max: 0xff },
    g: { min: 0x60, max: 0xff },
    b: { min: 0x60, max: 0xff },
    ...offsets
  };

  // Generate some number between 0 and 1 from the string.
  const numFromString = numberFromString(value);
  // Use it to seed the random number generator
  const randomGenerator = mulberry32(Math.floor(numFromString * 0xfffffff));

  // Generate r,g,b values between 0 and 1.
  const r = randomGenerator();
  const g = randomGenerator();
  const b = randomGenerator();
  // Convert to a number between 0 and 0xFFFFFF, regard the offsets.
  const colorNumber =
    Math.floor(r * (colRange.r.max - colRange.r.min) + colRange.r.min) * 0x10000 +
    Math.floor(g * (colRange.g.max - colRange.g.min) + colRange.g.min) * 0x100 +
    Math.floor(b * (colRange.b.max - colRange.b.min) + colRange.b.min);

  // Convert to padded hex string.
  const hex = colorNumber.toString(16).padStart(6, '0');
  return `#${hex}`;
};

export const numberFromString = (seed) => {
  // make next lines disable no-bitwise eslint using eslint block disable
  return Math.abs(
    Math.sin(
      seed.split('').reduce((a, b) => {
        // eslint-disable-next-line no-param-reassign
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0)
    )
  );
};