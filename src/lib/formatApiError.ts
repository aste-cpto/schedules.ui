const HTML_RESPONSE_PATTERN = /<!doctype|<html[\s>]/i

function isHtmlResponse(message: string): boolean {
  return HTML_RESPONSE_PATTERN.test(message)
}

function getStatusMessage(status: number): string {
  switch (status) {
    case 404:
      return 'Сервер не знайшов дані.'
    case 401:
      return 'Потрібна авторизація для доступу до даних.'
    case 403:
      return 'Немає доступу до цих даних.'
    case 500:
    case 502:
    case 503:
      return 'Сервер тимчасово недоступний. Спробуйте пізніше.'
    default:
      return `Щось пішло не так (код ${status}). Спробуйте ще раз.`
  }
}

function parseJsonMessage(rawMessage: string): string | null {
  try {
    const parsed = JSON.parse(rawMessage) as { message?: string; error?: string; title?: string }
    return parsed.message ?? parsed.error ?? parsed.title ?? null
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
    return jsonMessage
  }

  const trimmed = rawMessage.trim()
  if (trimmed.length > 0 && trimmed.length <= 200 && !trimmed.includes('<')) {
    return trimmed
  }

  return getStatusMessage(status)
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.name === 'ApiError' && 'status' in err) {
    const apiErr = err as Error & { status: number }
    return formatApiErrorMessage(apiErr.status, apiErr.message)
  }

  if (err instanceof TypeError) {
    return 'Не вдалося підключитися до сервера. Перевірте, чи запущений бекенд.'
  }

  return fallback
}
