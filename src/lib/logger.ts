// src/lib/logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
}

const formatEntry = (entry: LogEntry): string =>
  `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`

const createLogger = () => {
  const log = (level: LogLevel, message: string, data?: unknown) => {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    }

    if (import.meta.env.DEV) {
      const formatted = formatEntry(entry)
      switch (level) {
        case 'debug': console.debug(formatted, data ?? ''); break
        case 'info': console.info(formatted, data ?? ''); break
        case 'warn': console.warn(formatted, data ?? ''); break
        case 'error': console.error(formatted, data ?? ''); break
      }
    }
  }

  return {
    debug: (msg: string, data?: unknown) => log('debug', msg, data),
    info: (msg: string, data?: unknown) => log('info', msg, data),
    warn: (msg: string, data?: unknown) => log('warn', msg, data),
    error: (msg: string, data?: unknown) => log('error', msg, data),
  }
}

export const logger = createLogger()
