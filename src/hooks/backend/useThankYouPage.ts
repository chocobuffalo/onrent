'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTracking } from './useTracking';

export const useThankYouPage = () => {
  const { trackPurchase } = useTracking();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const value = searchParams.get("value")
      ? parseFloat(searchParams.get("value")!)
      : 1.0;
    const transactionId =
      searchParams.get("transactionId") || Date.now().toString();


    trackPurchase({ value, transactionId });
    
    
    setIsLoading(false);
  }, [isClient, searchParams, trackPurchase]);

  return {
    isLoading: !isClient || isLoading,
    isClient,
  };
};