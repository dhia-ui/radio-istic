/**
 * Password Strength Validator
 * Validates password strength and provides feedback
 */

export interface PasswordStrength {
  score: number; // 0-4
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
  isValid: boolean;
}

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Check length
  if (password.length < MIN_PASSWORD_LENGTH) {
    feedback.push(`Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`);
  } else if (password.length >= MIN_PASSWORD_LENGTH) {
    score += 1;
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    feedback.push(`Le mot de passe ne peut pas dépasser ${MAX_PASSWORD_LENGTH} caractères`);
    return {
      score: 0,
      strength: 'very-weak',
      feedback,
      isValid: false,
    };
  }

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez des lettres minuscules');
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez des lettres majuscules');
  }

  // Check for numbers
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez des chiffres');
  }

  // Check for special characters
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez des caractères spéciaux (!@#$%^&*...)');
  }

  // Check for common patterns
  const commonPatterns = [
    /^12345/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /admin/i,
    /letmein/i,
    /welcome/i,
    /monkey/i,
    /dragon/i,
    /master/i,
  ];

  const hasCommonPattern = commonPatterns.some(pattern => pattern.test(password));
  if (hasCommonPattern) {
    score = Math.max(0, score - 2);
    feedback.push('Évitez les mots de passe courants');
  }

  // Check for sequential characters
  if (/(\d)\1{2,}/.test(password) || /([a-zA-Z])\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Évitez les caractères répétés');
  }

  // Determine strength level
  let strength: PasswordStrength['strength'];
  if (score === 0) {
    strength = 'very-weak';
  } else if (score <= 1) {
    strength = 'weak';
  } else if (score === 2) {
    strength = 'fair';
  } else if (score === 3) {
    strength = 'good';
  } else {
    strength = 'strong';
  }

  // Add positive feedback for strong passwords
  if (score >= 4 && feedback.length === 0) {
    feedback.push('Excellent! Mot de passe très sécurisé');
  } else if (score === 3 && feedback.length === 0) {
    feedback.push('Bon mot de passe');
  }

  const isValid = score >= 3 && password.length >= MIN_PASSWORD_LENGTH;

  return {
    score,
    strength,
    feedback,
    isValid,
  };
}

export function getStrengthColor(strength: PasswordStrength['strength']): string {
  switch (strength) {
    case 'very-weak':
      return 'text-red-500';
    case 'weak':
      return 'text-orange-500';
    case 'fair':
      return 'text-yellow-500';
    case 'good':
      return 'text-blue-500';
    case 'strong':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}

export function getStrengthLabel(strength: PasswordStrength['strength']): string {
  switch (strength) {
    case 'very-weak':
      return 'Très faible';
    case 'weak':
      return 'Faible';
    case 'fair':
      return 'Moyen';
    case 'good':
      return 'Bon';
    case 'strong':
      return 'Fort';
    default:
      return '';
  }
}
