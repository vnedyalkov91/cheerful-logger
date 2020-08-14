const moment = require('moment');
const utils = require('./utils');
const chalk = require('chalk');

/**
 * Try to stringify object (if its already string just returns it)
 * @param {*} data
 * @returns {string}
 */
function stringifyObject(data) {
  if(data !== Object(data)) {
    return data;
  }
  try {
    return JSON.stringify(data);
  } catch (error) {
    return data;
  }
}

/**
 * Builds "MAIN" metrics info
 * format: {date}, ({sender}) {origin} {method} {path}
 * example: August 13th 2020, 2:05:59 pm, (1597316759124:DESKTOP-DASD39:10836:psda54ad:10000) http://localhost:5000 POST /v1/auth
 * @param {*} info
 * @param {*} method
 * @param {*} url
 * @param {*} payload
 * @param {*} query
 * @param {*} params
 * @param {*} headers
 * @param {*} options
 * @returns {string}
 */
function buildMain(info, method, url, payload, query, params, headers, options) {
  let message = '';
  message += `${utils.colorize(utils.colors.cyanBright, `(${info.id})`)} ${moment(info.received).format(options.dateFormat)},`;
  message += ` ${utils.colorize(utils.colors.blackBright, url.origin)}`;
  message += ` ${utils.colorize(utils.getMethodColor(method.toUpperCase(), options), method.toUpperCase())}`;
  if(options.showInlineQuery) {
    message += ` ${stringifyObject(query)}`;
  }
  if(options.showInlineParams) {
    message += ` ${stringifyObject(params)}`;
  }
  if(options.showInlineHeaders) {
    message += ` ${stringifyObject(headers)}`;
  }
  if(options.showInlinePayload) {
    message += ` ${stringifyObject(payload)}`;
  }
  message += ` ${chalk.underline(url.pathname)}`;
  return message;
}

/**
 * Builds "MAIN" metrics additional info for response
 * @param {*} statusCode
 * @param {*} source
 * @param {*} options
 * @returns {string}
 */
function buildMainAddons(statusCode, source, options) {
  let message = '';
  const tempMessageBus = [];

  if(options.showInlineResponseCode || options.showInlineResponse || options.showInlineResponseError) {
    message += ' - ';
  }

  if(options.showInlineResponseCode) {
    if(options.showInlineResponseError) {
      const error = source.error || 'OK';
      if(error) {
        tempMessageBus.push(
          `${utils.colorize(utils.getStatusCodeColor(statusCode, options), statusCode)} ${utils.colorize(utils.getStatusCodeColor(statusCode, options), stringifyObject(error))}`);
      }
    }
  } else {
    if(options.showInlineResponseError) {
      const error = source.error || 'OK';
      if(error) {
        tempMessageBus.push(`${utils.colorize(utils.getStatusCodeColor(statusCode, options), stringifyObject(error))}`);
      }
    }
  }

  if(options.showInlineResponse) {
    tempMessageBus.push(`${stringifyObject(source)}`);
  }

  message += tempMessageBus.join(', ');

  return message;
}

/**
 * Builds "RESPONSE" additional metrics info
 * format: [Request] --statusCode --headers --response
 * (!) Can be disabled trough options
 * @param {*} headers
 * @param {*} payload
 * @param {*} query
 * @param {*} params
 * @returns {string}
 */
function BuildResponseAdditionalInfo(headers, source, statusCode, options) {
  let message = '';
  message += utils.colorize(utils.colors.cyanBright, '[Response]');
  message += `\n    ${utils.colorize(utils.colors.blackBright, '--statusCode:')} ${utils.colorize(utils.getStatusCodeColor(statusCode, options), statusCode)}`;
  message += `\n    ${utils.colorize(utils.colors.blackBright, '--headers:')} ${stringifyObject(headers)}`;
  message += `\n    ${utils.colorize(utils.colors.blackBright, '--response:')} ${stringifyObject(source)}`;
  return message;
}

/**
 * Builds "REQUEST" additional metrics info
 * format: [Request] --headers --query --params --payload
 * (!) Can be disabled trough options
 * @param {*} headers
 * @param {*} payload
 * @param {*} query
 * @param {*} params
 * @returns {string}
 */
function buildRequestAdditionalInfo(headers, payload, query, params) {
  let message = '';
  message += utils.colorize(utils.colors.cyanBright, '[Request]');
  message += `\n    ${utils.colorize(utils.colors.blackBright, '--headers:')} ${stringifyObject(headers)}`;
  message += `\n    ${utils.colorize(utils.colors.blackBright, '--query:')} ${stringifyObject(query)}`;
  message += `\n    ${utils.colorize(utils.colors.blackBright, '--params:')} ${stringifyObject(params)}`;
  message += `\n    ${utils.colorize(utils.colors.blackBright, '--payload:')} ${stringifyObject(payload)}`;
  return message;
}

/**
 * Handles "OnRequest" lifecycle
 * @param {*} method
 * @param {*} url
 * @param {*} headers
 * @param {*} payload
 * @param {*} query
 * @param {*} params
 * @param {*} info
 * @param {*} options
 * @returns {string[]}
 */
function handleOnRequestsLifecycle(method, url, headers = {}, payload = {}, query = {}, params = {}, info, options) {
  const print = [];

  //Build main outcome
  print.push(buildMain(info, method, url, payload, query, params, headers, options));

  if(options.showRequestInfo) {
    print.push(buildRequestAdditionalInfo(headers, payload, query, params));
  }

  return print;
}

/**
 * Handles "OnResponse" lifecycle
 * @param {*} headers
 * @param {*} source
 * @param {*} statusCode
 * @param {*} options
 * @returns {string[]}
 */
function handleOnResponseLifecycle(headers = {}, source = {}, statusCode, options) {
  const print = [];

  if(options.showResponseInfo) {
    print.push(BuildResponseAdditionalInfo(headers, source, statusCode, options));
  }

  return print;
}

/**
 * Main Monitor outlet
 * @param {*} server
 * @param {*} options
 * @returns {void}
 */
exports.monitor = (server, options) => {
  let messageBus = [];

  server.ext('onPreAuth', (request, handler) => {
    const { method, url, headers, payload, query, params, info } = request;
    if(options.onRequest) {
      messageBus = options.onRequest(request, options);
    } else {
      messageBus = handleOnRequestsLifecycle(method, url, headers, payload, query, params, info, options);
    }
    return handler.continue;
  });

  server.ext('onPreHandler', (request, handler) => {
    const { method, url, headers, payload, query, params, info } = request;
    if(options.onRequest) {
      messageBus = options.onRequest(request, options);
    } else {
      messageBus = handleOnRequestsLifecycle(method, url, headers, payload, query, params, info, options);
    }
    return handler.continue;
  });

  server.events.on('response', (request) => {
    const { response, info } = request;
    const { headers, source = {}, statusCode } = response;

    if(options.onResponse) {
      messageBus = [...messageBus, ...options.onResponse(request, options)];
    } else {
      if(options.showResponseTime) {
        messageBus[0] += ` (${info.completed - info.received}ms)`;
      }

      messageBus[0] += buildMainAddons(statusCode, source, options);

      messageBus = [...messageBus, ...handleOnResponseLifecycle(headers, source, statusCode, options)];
    }

    console.log(messageBus.join('\n'));
  });
}