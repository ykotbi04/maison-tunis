// TND Currency Formatter
export const formatTND = (amount: number): string => {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount)
}

export const formatTNDSimple = (amount: number): string => {
  return `${amount.toFixed(3)} TND`
}

// Convert to TND (assuming input is in base currency)
export const toTND = (amount: number): string => {
  return formatTND(amount)
}
