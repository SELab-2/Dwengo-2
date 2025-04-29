import log4js from "log4js";

// When testing on server use "warning" or "error" defined in env files
const logLevel: string = process.env.LOG_LEVEL || "info";

export const config = {
    appenders: {
        console: { type: "console" },
        file: { type: "file", filename: "app.log" },
        errors: { type: "file", filename: "errors.log" },
    },
    categories: {
        default: { appenders: ["console", "file"], level: logLevel},
        http: { appenders: ["console", "file"], level: logLevel },
        error: { appenders: ["console", "errors"], level: "error" },
    },
};

export function setupLogger() {
    log4js.configure(config);
}

export const logger = log4js.getLogger();
export const httpLogger = log4js.getLogger("http");
export const errorLogger = log4js.getLogger("error");

export function getLogger(category: string) {
    return log4js.getLogger(category);
}
