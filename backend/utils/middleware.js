const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info(request.method, ': ', request.path)
    next()
  }

const unknownEndPoint = (request, response) => {
    response.status(404).send({error : 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
  console.error("Error:", error);

  response.status(500).json({
    error: error.message,
    detail: error.detail || null,
    hint: error.hint || null
  });
};


module.exports = {
    requestLogger,
    unknownEndPoint,
    errorHandler
}