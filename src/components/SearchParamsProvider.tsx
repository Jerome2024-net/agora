'use client';

import { useSearchParams } from 'next/navigation';
import { createContext, useContext, ReactNode } from 'react';

const SearchParamsContext = createContext<URLSearchParams | null>(null);

export function SearchParamsProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  return (
    <SearchParamsContext.Provider value={searchParams}>
      {children}
    </SearchParamsContext.Provider>
  );
}

export function useSearchParamsContext() {
  const context = useContext(SearchParamsContext);
  if (!context) {
    // Retourner un URLSearchParams vide si pas de contexte (SSG)
    return new URLSearchParams();
  }
  return context;
}
