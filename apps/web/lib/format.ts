import type { ListingType } from '@estatex/types';

export function formatPrice(value: number, listingType?: ListingType) {
  const formatted =
    value >= 10_000_000
      ? `PKR ${(value / 10_000_000).toFixed(2).replace(/\.00$/, '')} Cr`
      : value >= 100_000
        ? `PKR ${(value / 100_000).toFixed(1).replace(/\.0$/, '')} Lakh`
        : new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            maximumFractionDigits: 0,
          }).format(value);

  return listingType === 'RENT' ? `${formatted}/mo` : formatted;
}

export function formatArea(area: number, unit = 'SQFT') {
  const label = unit === 'SQFT' ? 'sqft' : unit.toLowerCase();
  return `${new Intl.NumberFormat('en-US').format(area)} ${label}`;
}

export function prettyEnum(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
}
