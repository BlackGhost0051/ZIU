export type PasswordStrength = 'słabe' | 'średnie' | 'silne';

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 'słabe';

  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return 'słabe';
  if (score <= 4) return 'średnie';
  return 'silne';
}

export function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'słabe':
      return 'text-red-600';
    case 'średnie':
      return 'text-yellow-600';
    case 'silne':
      return 'text-green-600';
  }
}
