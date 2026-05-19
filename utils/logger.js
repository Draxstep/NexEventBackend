import fs from "node:fs/promises";
import path from "node:path";

const logFilePath = process.env.LOG_FILE_PATH
    ?? path.join(process.cwd(), "logs", "app.log");

const writeLog = async (entry) => {
    try {
        await fs.mkdir(path.dirname(logFilePath), { recursive: true });
        await fs.appendFile(logFilePath, `${JSON.stringify(entry)}\n`, "utf8");
    } catch {
        // Avoid throwing from logger to keep app flow intact.
    }
};

const buildEntry = (level, message, meta) => ({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta } : {})
});

const logger = {
    info: (message, meta) => writeLog(buildEntry("info", message, meta)),
    warn: (message, meta) => writeLog(buildEntry("warn", message, meta)),
    error: (message, meta) => writeLog(buildEntry("error", message, meta)),
    debug: (message, meta) => writeLog(buildEntry("debug", message, meta))
};

export default logger;