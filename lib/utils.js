const chalk = require('chalk');

/**
 * Font colors
 */
 const colors = {
  black: 'black',
  red: 'red',
  green: 'green',
  yellow: 'yellow',
  blue: 'blue',
  magenta: 'magenta',
  cyan: 'cyan',
  white: 'white',
  blackBright: 'blackBright',
  redBright: 'redBright',
  greenBright: 'greenBright',
  yellowBright: 'yellowBright',
  blueBright: 'blueBright',
  magentaBright: 'magentaBright',
  cyanBright: 'cyanBright',
  whiteBright: 'whiteBright'
};

exports.colors = colors;

/**
 * Background colors
 */
const backgroundColors = {
  bgBlack: 'bgBlack',
  bgRed: 'bgRed',
  bgGreen: 'bgGreen',
  bgYellow: 'bgYellow',
  bgBlue: 'bgBlue',
  bgMagenta: 'bgMagenta',
  bgCyan: 'bgCyan',
  bgWhite: 'bgWhite',
  bgBlackBright: 'bgBlackBright',
  bgRedBright: 'bgRedBright',
  bgGreenBright: 'bgGreenBright',
  bgYellowBright: 'bgYellowBright',
  bgBlueBright: 'bgBlueBright',
  bgMagentaBright: 'bgMagentaBright',
  bgCyanBright: 'bgCyanBright',
  bgWhiteBright: 'bgWhiteBright',
}

exports.backgroundColors = backgroundColors;

/**
 * Colorize passed message
 * @param {*} color
 * @param {*} message
 * @returns {string}
 */
exports.colorize = (color, message) => {
  return chalk[color](message);
}

/**
 * Get method colors
 * @param {*} method
 * @returns {string}
 */
exports.getMethodColor = (method, options) => {
  switch (method) {
    case 'POST':
      return options.colors.methods.post;
    case 'GET':
      return options.colors.methods.get;
    case 'HEAD':
      return options.colors.methods.head;
    case 'PUT':
      return options.colors.methods.put;
    case 'PATCH':
      return options.colors.methods.patch;
    case 'DELETE':
      return options.colors.methods.delete;
    case 'CONNECT':
      return options.colors.methods.connect;
    case 'OPTIONS':
      return options.colors.methods.options;
    case 'TRACE':
      return options.colors.methods.trace;
    default:
      return backgroundColors.bgWhiteBright;
  }
}

/**
 * Get statusCode colors
 * @param {*} statusCode
 * @returns {string}
 */
exports.getStatusCodeColor = (statusCode, options) => {
  if (statusCode >= 0 && statusCode < 200) {
    return options.colors.statusCode.informational;
  } else if (statusCode >= 200 && statusCode < 300) {
    return options.colors.statusCode.success;
  } else if (statusCode >= 300 && statusCode < 400) {
    return options.colors.statusCode.redirection;
  } else if (statusCode >= 400 && statusCode < 500) {
    return options.colors.statusCode.clientError;
  } else {
    return options.colors.statusCode.serverError;
  }
}