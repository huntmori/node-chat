import winston from "winston";

let logger:winston.Logger | undefined;

export function getLogger(): winston.Logger
{
    if (!logger) {
        console.log(
            "["
            + new Date().toISOString()
                .split('.')[0]
                .replace('T', ' ')
            + "][info]: " + 'logger created');        logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}][${level}]: ${message}`;
                })
            ),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize({ all: true }),
                        winston.format.printf(({ timestamp, level, message }) => {
                            return `[${timestamp}][${level}]: ${message}`;
                        })
                    )
                }),
                new winston.transports.File({
                    filename: 'ws-server.log',
                    format: winston.format.printf(({ timestamp, level, message }) => {
                        return `[${timestamp}][${level}]: ${message}`;
                    })
                })
            ]
        });
    }
    return logger;
}