const HTML_RESPONSE_PATTERN = /<!doctype|<html[\s>]/i

const CYRILLIC_PATTERN = /[а-яіїєґ]/i

const GENERIC_HTTP_MESSAGES = new Map<string, string>([
  ['not found', 'Дані не знайдено.'],
  ['bad request', 'Некоректний запит.'],
  ['unauthorized', 'Потрібна авторизація.'],
  ['forbidden', 'Немає доступу.'],
  ['internal server error', 'Помилка сервера.'],
  ['conflict', 'Конфлікт даних.'],
  ['unprocessable entity', 'Дані не пройшли перевірку.'],
  ['method not allowed', 'Метод не дозволено.'],
  ['service unavailable', 'Сервер тимчасово недоступний.'],
  ['gateway timeout', 'Час очікування сервера вичерпано.'],
  ['too many requests', 'Забагато запитів. Спробуйте пізніше.'],
  ['no content', 'Немає даних.'],
  ['unsupported media type', 'Непідтримуваний тип даних.'],
  ['request timeout', 'Час очікування вичерпано.'],
  ['gone', 'Ресурс більше недоступний.'],
  ['payload too large', 'Занадто великий обсяг даних.'],
])

function isHtmlResponse(message: string): boolean {
  return HTML_RESPONSE_PATTERN.test(message)
}

function normalizeMessage(message: string): string {
  return message.trim().toLowerCase().replace(/\.+$/, '')
}

function getStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Некоректний запит.'
    case 401:
      return 'Потрібна авторизація для доступу до даних.'
    case 403:
      return 'Немає доступу до цих даних.'
    case 404:
      return 'Дані не знайдено.'
    case 409:
      return 'Конфлікт даних.'
    case 422:
      return 'Дані не пройшли перевірку.'
    case 500:
    case 502:
    case 503:
      return 'Сервер тимчасово недоступний. Спробуйте пізніше.'
    default:
      return `Щось пішло не так (код ${status}). Спробуйте ще раз.`
  }
}

function translateGenericHttpMessage(message: string): string | null {
  const normalized = normalizeMessage(message)

  const exact = GENERIC_HTTP_MESSAGES.get(normalized)
  if (exact) return exact

  if (/\bnot\s+found\b/i.test(message)) {
    return 'Дані не знайдено.'
  }

  return null
}

function localizeApiMessage(message: string, status: number): string {
  const trimmed = message.trim()
  if (!trimmed) return getStatusMessage(status)

  if (CYRILLIC_PATTERN.test(trimmed)) {
    return trimmed
  }

  const translated = translateGenericHttpMessage(trimmed)
  if (translated) return translated

  if (trimmed.length <= 40 && /^[\w\s.,'"-]+$/i.test(trimmed)) {
    return getStatusMessage(status)
  }

  return trimmed
}

function parseJsonMessage(rawMessage: string): string | null {
  try {
    const parsed = JSON.parse(rawMessage) as {
      message?: string
      error?: string
      title?: string
      detail?: string
    }

    return parsed.message ?? parsed.detail ?? parsed.error ?? parsed.title ?? null
  } catch {
    return null
  }
}

export function formatApiErrorMessage(status: number, rawMessage: string): string {
  if (isHtmlResponse(rawMessage)) {
    return getStatusMessage(status)
  }

  const jsonMessage = parseJsonMessage(rawMessage.trim())
  if (jsonMessage) {
    return localizeApiMessage(jsonMessage, status)
  }

  const trimmed = rawMessage.trim()
  if (trimmed.length > 0 && trimmed.length <= 200 && !trimmed.includes('<')) {
    return localizeApiMessage(trimmed, status)
  }

  return getStatusMessage(status)
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.name === 'ApiError' && 'status' in err) {
    const apiErr = err as Error & { status: number }
    if (apiErr.status === 401) return ''
    return formatApiErrorMessage(apiErr.status, apiErr.message)
  }

  if (err instanceof TypeError) {
    return 'Не вдалося підключитися до сервера.'
  }

  return fallback
}
