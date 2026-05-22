export type PasswordStrengthLevel = "weak" | "fair" | "good" | "strong";

export interface PasswordStrengthResult {
  level: PasswordStrengthLevel;
  label: string;
  segments: number;
  colorClass: string;
}

export function getPasswordStrength(password: string): PasswordStrengthResult {
  if (!password || password.length < 8) {
    return {
      level: "weak",
      label: "Weak",
      segments: 1,
      colorClass: "bg-rose-500",
    };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (
    password.length >= 12 &&
    hasLower &&
    hasUpper &&
    hasNumber &&
    hasSpecial
  ) {
    return {
      level: "strong",
      label: "Strong",
      segments: 4,
      colorClass: "bg-emerald-500",
    };
  }

  if (hasLower && hasUpper && hasNumber) {
    return {
      level: "good",
      label: "Good",
      segments: 3,
      colorClass: "bg-indigo-500",
    };
  }

  return {
    level: "fair",
    label: "Fair",
    segments: 2,
    colorClass: "bg-amber-500",
  };
}
