export function formatMenuPrice(amount: number, currencyCode: string, locale = "en"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : undefined,
  }).format(amount);
}
