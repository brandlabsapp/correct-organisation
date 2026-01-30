import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number | string | undefined | null,
  currencyCode: string = 'INR'
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : (amount || 0);
  
  const locales: Record<string, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
  };

  return new Intl.NumberFormat(locales[currencyCode] || 'en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
}
