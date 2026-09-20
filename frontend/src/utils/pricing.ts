export const calculateDiscountedPrice = (basePrice: number, discountPercentage: number): number => {
  if (!discountPercentage || discountPercentage <= 0) return basePrice;
  const discounted = basePrice * (1 - discountPercentage / 100);
  return Math.round(discounted);
};
