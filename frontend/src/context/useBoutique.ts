import { useContext } from 'react';
import { BoutiqueContext } from './boutiqueContextInstance';
import type { BoutiqueContextType } from './boutiqueContextInstance';

export const useBoutique = (): BoutiqueContextType => {
  const context = useContext(BoutiqueContext);
  if (!context) {
    throw new Error('useBoutique must be used within a BoutiqueProvider');
  }
  return context;
};
