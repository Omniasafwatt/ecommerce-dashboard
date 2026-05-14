import { format, formatDistance, parseISO, isValid } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

// ─── Currency ─────────────────────────────────────────────────────────────────

/**
 * Format a numeric amount as a currency string.
 * @param amount - The numeric value to format
 * @param currency - ISO currency code (default: 'KWD')
 * @param locale - Locale string (default: 'en-KW')
 */
export const formatCurrency = (
  amount: number,
  currency = 'KWD',
  locale = 'en-KW'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount)
}

// ─── Dates ────────────────────────────────────────────────────────────────────

const toDate = (date: string | Date): Date => {
  if (date instanceof Date) return date
  const parsed = parseISO(date)
  return isValid(parsed) ? parsed : new Date(date)
}

/**
 * Format a date to a readable string.
 * @param date - ISO string or Date object
 * @param fmt - date-fns format string (default: 'dd/MM/yyyy')
 * @param language - 'en' | 'ar' for locale (default: 'en')
 */
export const formatDate = (
  date: string | Date,
  fmt = 'dd/MM/yyyy',
  language: 'en' | 'ar' = 'en'
): string => {
  try {
    return format(toDate(date), fmt, {
      locale: language === 'ar' ? ar : enUS,
    })
  } catch {
    return String(date)
  }
}

/**
 * Format a date with time included.
 */
export const formatDateTime = (
  date: string | Date,
  language: 'en' | 'ar' = 'en'
): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm', language)
}

/**
 * Format a date as a relative time string (e.g. "3 hours ago").
 */
export const formatRelativeTime = (
  date: string | Date,
  language: 'en' | 'ar' = 'en'
): string => {
  try {
    return formatDistance(toDate(date), new Date(), {
      addSuffix: true,
      locale: language === 'ar' ? ar : enUS,
    })
  } catch {
    return String(date)
  }
}

// ─── Status helpers ───────────────────────────────────────────────────────────

type AnyStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'rejected'
  | 'active'
  | 'inactive'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'approved'
  | string

const STATUS_COLOR_MAP: Record<string, string> = {
  // Order statuses
  pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  accepted: 'text-blue-600 bg-blue-50 border-blue-200',
  preparing: 'text-orange-600 bg-orange-50 border-orange-200',
  out_for_delivery: 'text-purple-600 bg-purple-50 border-purple-200',
  delivered: 'text-green-600 bg-green-50 border-green-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200',
  rejected: 'text-red-700 bg-red-50 border-red-200',
  // General statuses
  active: 'text-green-600 bg-green-50 border-green-200',
  inactive: 'text-gray-500 bg-gray-50 border-gray-200',
  // Payment statuses
  paid: 'text-green-600 bg-green-50 border-green-200',
  failed: 'text-red-600 bg-red-50 border-red-200',
  refunded: 'text-blue-600 bg-blue-50 border-blue-200',
  // Refund/review statuses
  approved: 'text-green-600 bg-green-50 border-green-200',
}

/**
 * Returns a Tailwind CSS class string for a given status value.
 */
export const getStatusColor = (status: AnyStatus): string => {
  return (
    STATUS_COLOR_MAP[status] ?? 'text-gray-600 bg-gray-50 border-gray-200'
  )
}

const STATUS_LABEL_EN: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
  active: 'Active',
  inactive: 'Inactive',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
  approved: 'Approved',
}

const STATUS_LABEL_AR: Record<string, string> = {
  pending: 'قيد الانتظار',
  accepted: 'مقبول',
  preparing: 'قيد التحضير',
  out_for_delivery: 'في الطريق',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
  rejected: 'مرفوض',
  active: 'نشط',
  inactive: 'غير نشط',
  paid: 'مدفوع',
  failed: 'فشل',
  refunded: 'مسترد',
  approved: 'موافق عليه',
}

/**
 * Returns a human-readable label for a status.
 */
export const getStatusLabel = (
  status: AnyStatus,
  language: 'en' | 'ar' = 'en'
): string => {
  const map = language === 'ar' ? STATUS_LABEL_AR : STATUS_LABEL_EN
  return map[status] ?? status
}

// ─── String helpers ───────────────────────────────────────────────────────────

/**
 * Truncate a string to a maximum length, appending an ellipsis if needed.
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Format a phone number for display.
 */
export const formatPhone = (phone: string): string => {
  // Simple formatter — customize per region as needed
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{4})(\d{4})/, '$1 $2')
  }
  return phone
}

/**
 * Format a large number with locale-aware separators.
 */
export const formatNumber = (
  value: number,
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Format a percentage value.
 */
export const formatPercent = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`
}
