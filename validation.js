export function validatePassword(pw) {
  const value = String(pw || '')
  if (value.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter'
  if (!/[0-9]/.test(value)) return 'Password must include a number'
  return null
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase())
}

