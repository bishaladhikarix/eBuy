// Currency formatting utility for NPR (Nepalese Rupees)
export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return 'Rs. 0';
  }
  
  // Format with NPR currency
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

// Alternative simple format for consistent display
export const formatPriceSimple = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return 'Rs. 0';
  }
  
  // Simple format with Rs. prefix
  return `Rs. ${numPrice.toLocaleString('en-IN')}`;
};
