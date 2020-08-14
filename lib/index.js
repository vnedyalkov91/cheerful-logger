const { monitor } = require('./monitor');
const { backgroundColors, colors } = require('./utils');

exports.plugin = {
  pkg: require('../package.json'),
  requirements: {
      hapi: '>=18.4.0'
  },
  register: function (server, options = {}) {
    const defaultOptions = {
      // Main options
      showRequestInfo: false,
      showResponseInfo: false,
      // Inline options
      dateFormat: 'MM/DD/YYYY, hh:mm:ss',
      showResponseTime: true,
      showInlinePayload: true,
      showInlineQuery: false,
      showInlineParams: false,
      showInlineHeaders: false,
      showInlineResponseCode: true,
      showInlineResponse: false,
      showInlineResponseError: true,
      // Events
      onRequest: null,
      onResponse: null,
      // Colors options
      colors: {
        methods: {
          post: backgroundColors.bgGreenBright,
          get: backgroundColors.bgCyanBright,
          head: backgroundColors.bgBlackBright,
          put: backgroundColors.bgYellowBright,
          patch : backgroundColors.bgYellowBright,
          delete: backgroundColors.bgRedBright,
          connect: backgroundColors.bgWhiteBright,
          option: backgroundColors.bgWhiteBright,
          trace : backgroundColors.bgWhiteBright
        },
        statusCode: {
          informational: colors.whiteBright,
          success: colors.greenBright,
          redirection: colors.blueBright,
          clientError: colors.yellowBright,
          serverError: colors.redBright
        }
      }
    };
    const emittedOptions = {
      ...defaultOptions,
      ...options
    }
    monitor(server, emittedOptions);
  }
};