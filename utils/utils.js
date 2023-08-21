'use strict';

const stringGenerator = (length, charSetString) => {
  let outputString = '';
  let chars = '';

  chars += charSetString.indexOf('a') > -1 ? 'abcdefghijklmnopqrstuvwxyz' : '';
  chars += charSetString.indexOf('A') > -1 ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '';
  chars += charSetString.indexOf('1') > -1 ? '1234567890' :
    '';
  chars += charSetString.indexOf('!') > -1 ? '!@#$%^&*()_+-=' : '';

  for (let i = 0; i < length; i++) {
    outputString += chars[Math.floor(Math.random() * chars.length)];
  }

  return outputString;
};

module.exports = stringGenerator;