import { useState, useCallback } from 'react';
import axios from 'axios';

interface AuctionResult {
  title: string;
  price: {
    amount: number;
    currency: string;
    symbol: string;
  };
  auctionHouse: string;
  date: string;
  lotNumber: string;
  saleType: string;
}

interface AuctionResultsResponse {
  success: boolean;
  results: {
    keyword: string;
    totalResults: number;
    minPrice: number;
    auctionResults: AuctionResult[];
  };
  keywords?: string[];
}

interface UseAuctionDataResult {
  getAuctionResults: (sessionId: string) => Promise<AuctionResult[]>;
  getKeywordResults: (keyword: string, minPrice?: number, limit?: number) => Promise<AuctionResult[]>;
  isLoading: boolean;
  error: string | null;
  results: AuctionResult[];
  keywords: string[];
}

export function useAuctionData(apiUrl?: string): UseAuctionDataResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AuctionResult[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  const baseUrl = apiUrl || import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const getAuctionResults = useCallback(async (sessionId: string): Promise<AuctionResult[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<AuctionResultsResponse>(
        `${baseUrl}/auction-results`,
        { sessionId }
      );

      if (response.data.success && response.data.results) {
        setResults(response.data.results.auctionResults);
        
        if (response.data.keywords) {
          setKeywords(response.data.keywords);
        }
        
        return response.data.results.auctionResults;
      } else {
        throw new Error('Failed to fetch auction results');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error fetching auction results: ${errorMessage}`);
      console.error('Error fetching auction results:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  const getKeywordResults = useCallback(async (
    keyword: string, 
    minPrice: number = 1000, 
    limit: number = 10
  ): Promise<AuctionResult[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<AuctionResultsResponse>(
        `${baseUrl}/auction-results`,
        { keyword, minPrice, limit }
      );

      if (response.data.success && response.data.results) {
        setResults(response.data.results.auctionResults);
        return response.data.results.auctionResults;
      } else {
        throw new Error('Failed to fetch auction results');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error fetching auction results: ${errorMessage}`);
      console.error('Error fetching keyword results:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  return {
    getAuctionResults,
    getKeywordResults,
    isLoading,
    error,
    results,
    keywords
  };
}

export default useAuctionData;