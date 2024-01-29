import winston from 'winston';
import Config from '../../config';

const { combine, timestamp, label, printf, json } = winston.format;

const logFormat = printf(info => {
  return `${info.timestamp} [${info.level}] ${info.module} : ${info.message} | ${info.status}`;
})

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    label({label: 'PC'}),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
    // json()
    ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ 
      dirname: Config.FILE_FOLDER_PATH,
      filename: 'error.log', 
      level: 'error' }),
    new winston.transports.File({ 
      dirname: Config.FILE_FOLDER_PATH,
      filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }

export { logger };