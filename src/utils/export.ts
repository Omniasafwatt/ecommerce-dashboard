import * as XLSX from 'xlsx'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ExportHeader {
  /** The key to read from each data row */
  key: string
  /** The human-readable column header */
  label: string
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

/**
 * Convert an array of objects to a CSV string and trigger a browser download.
 *
 * @param data - Array of plain objects
 * @param filename - Download filename (without extension)
 * @param headers - Column definitions (key + label)
 */
export const exportToCSV = <T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers: ExportHeader[]
): void => {
  if (!data.length) return

  const headerRow = headers.map((h) => escapeCSVValue(h.label)).join(',')
  const dataRows = data.map((row) =>
    headers.map((h) => escapeCSVValue(String(row[h.key] ?? ''))).join(',')
  )

  const csvContent = [headerRow, ...dataRows].join('\n')
  const blob = new Blob(['﻿' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  })

  downloadBlob(blob, `${sanitizeFilename(filename)}.csv`)
}

/** Escape a single CSV cell value */
const escapeCSVValue = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

// ─── Excel Export ─────────────────────────────────────────────────────────────

/**
 * Convert an array of objects to an Excel (.xlsx) file and trigger a browser download.
 *
 * @param data - Array of plain objects
 * @param filename - Download filename (without extension)
 * @param headers - Column definitions (key + label)
 * @param sheetName - Worksheet name (default: 'Sheet1')
 */
export const exportToExcel = <T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers: ExportHeader[],
  sheetName = 'Sheet1'
): void => {
  // Build the rows array (header row + data rows)
  const headerRow = headers.map((h) => h.label)
  const dataRows = data.map((row) =>
    headers.map((h) => row[h.key] ?? '')
  )

  const worksheetData = [headerRow, ...dataRows]
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  // Auto-size columns
  const colWidths = headers.map((h) => {
    const maxLength = Math.max(
      h.label.length,
      ...data.map((row) => String(row[h.key] ?? '').length)
    )
    return { wch: Math.min(maxLength + 2, 50) }
  })
  worksheet['!cols'] = colWidths

  // Style the header row (bold)
  const range = XLSX.utils.decode_range(worksheet['!ref'] ?? 'A1')
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c })
    if (!worksheet[cellAddress]) continue
    worksheet[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'F3F4F6' } },
    }
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  downloadBlob(blob, `${sanitizeFilename(filename)}.xlsx`)
}

// ─── Multiple sheets Excel Export ─────────────────────────────────────────────

export interface ExcelSheet<T extends Record<string, unknown>> {
  sheetName: string
  data: T[]
  headers: ExportHeader[]
}

/**
 * Export multiple sheets into a single Excel workbook.
 */
export const exportMultiSheetExcel = <T extends Record<string, unknown>>(
  sheets: ExcelSheet<T>[],
  filename: string
): void => {
  const workbook = XLSX.utils.book_new()

  sheets.forEach(({ sheetName, data, headers }) => {
    const headerRow = headers.map((h) => h.label)
    const dataRows = data.map((row) => headers.map((h) => row[h.key] ?? ''))
    const worksheetData = [headerRow, ...dataRows]
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  })

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  downloadBlob(blob, `${sanitizeFilename(filename)}.xlsx`)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const sanitizeFilename = (name: string): string =>
  name.replace(/[^a-z0-9_\-. ]/gi, '_').replace(/\s+/g, '_')
