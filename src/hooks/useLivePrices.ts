import { useState, useEffect } from 'react';

interface LivePrice {
  ID: string;
  Price: number;
}

export const useLivePrices = () => {
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbw8M3ydUxPXLvoswpHuYnBmxa7kW2oe2baqYoSfCyobGE4aFePhgotkVR3bzUCUYW1a/exec'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch live prices');
        }
        
        const data: LivePrice[] = await response.json();
        
        // Convert array to object for easier lookup
        const pricesMap = data.reduce((acc, item) => {
          acc[item.ID.toUpperCase()] = item.Price;
          return acc;
        }, {} as Record<string, number>);
        
        setLivePrices(pricesMap);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch prices');
        console.error('Error fetching live prices:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLivePrices();
    
    // Refresh prices every 5 minutes
    const interval = setInterval(fetchLivePrices, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { livePrices, isLoading, error };
};