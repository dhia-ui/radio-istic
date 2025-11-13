"use client"

import { cn } from "@/lib/utils"
import { validatePasswordStrength, getStrengthColor, getStrengthLabel } from "@/lib/password-validator"
import { CheckCircle2, XCircle } from "lucide-react"

interface PasswordStrengthIndicatorProps {
  password: string
  className?: string
}

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  if (!password) return null

  const result = validatePasswordStrength(password)
  const { score, strength, feedback } = result

  // Calculate percentage for progress bar
  const percentage = (score / 5) * 100

  return (
    <div className={cn("space-y-2", className)}>
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Force du mot de passe</span>
          <span className={cn("font-medium", getStrengthColor(strength))}>
            {getStrengthLabel(strength)}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300",
              strength === 'very-weak' && "bg-red-500",
              strength === 'weak' && "bg-orange-500",
              strength === 'fair' && "bg-yellow-500",
              strength === 'good' && "bg-blue-500",
              strength === 'strong' && "bg-green-500"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Feedback */}
      {feedback.length > 0 && (
        <ul className="space-y-1 text-sm">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              {result.isValid && feedback.length === 1 ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              )}
              <span className={cn(
                result.isValid && feedback.length === 1 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-muted-foreground"
              )}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
