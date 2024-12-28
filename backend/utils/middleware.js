const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info(request.method, ': ', request.path)
    next()
  }

const unknownEndPoint = (request, response) => {
    response.status(404).send({error : 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
    // Add errors when they are discovered

    logger.error(error.message)
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndPoint,
    errorHandler
}