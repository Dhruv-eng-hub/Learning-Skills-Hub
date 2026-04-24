export function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

