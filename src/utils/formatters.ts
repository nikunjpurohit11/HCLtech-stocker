/**
 * Formats a numeric value into the Indian Rupee representation (₹)
 * using the standard Indian numbering system (Lakhs, Crores).
 */
export function formatINR(
  val: number,
  options?: { decimals?: number; compact?: boolean }
): string {
  if (val === undefined || val === null || isNaN(val)) return '₹0.00';
  
  const decimals = options?.decimals !== undefined ? options.decimals : 2;
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  if (options?.compact) {
    if (absVal >= 10000000) {
      // Crores
      return `${isNegative ? '-' : ''}₹${(absVal / 10000000).toFixed(decimals)} Cr`;
    } else if (absVal >= 100000) {
      // Lakhs
      return `${isNegative ? '-' : ''}₹${(absVal / 100000).toFixed(decimals)} L`;
    } else if (absVal >= 1000) {
      return `${isNegative ? '-' : ''}₹${(absVal / 1000).toFixed(decimals)} K`;
    }
  }

  // Format with standard Indian separators (last 3, then groups of 2)
  const parts = absVal.toFixed(decimals).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return `${isNegative ? '-' : ''}₹${formattedInteger}${decimals > 0 ? decimalPart : ''}`;
}

export function formatPercent(
  val: number,
  showSign: boolean = true,
  decimals: number = 2
): string {
  if (val === undefined || val === null || isNaN(val)) return '0.00%';
  const sign = showSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(decimals)}%`;
}

export function formatNumber(
  val: number,
  options?: { decimals?: number; compact?: boolean }
): string {
  if (val === undefined || val === null || isNaN(val)) return '0';
  const decimals = options?.decimals ?? 2;
  const absVal = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (options?.compact) {
    if (absVal >= 10000000) return `${sign}${(absVal / 10000000).toFixed(decimals)}Cr`;
    if (absVal >= 100000) return `${sign}${(absVal / 100000).toFixed(decimals)}L`;
    if (absVal >= 1000) return `${sign}${(absVal / 1000).toFixed(decimals)}K`;
  }

  return val.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatVolume(volume: number): string {
  if (volume >= 10000000) return `${(volume / 10000000).toFixed(2)} Cr`;
  if (volume >= 100000) return `${(volume / 100000).toFixed(2)} L`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)} K`;
  return volume.toString();
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
