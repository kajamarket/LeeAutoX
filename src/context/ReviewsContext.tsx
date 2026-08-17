import React, { createContext, useContext, useState, useEffect } from 'react';
import { TESTIMONIALS } from '../constants';

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  quote: string;
  rating: number; // 1 - 5
  date: string;
  mediaType?: 'image' | 'video' | 'none';
  mediaUrl?: string;
  service?: string;
  verified: boolean;
}

// Convert original base testimonials into verified 5-star review items
export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'base-1',
    author: TESTIMONIALS[0].author,
    role: TESTIMONIALS[0].role,
    quote: TESTIMONIALS[0].quote,
    rating: 5,
    date: '2026-06-15',
    service: 'Toyota Land Cruiser Canadian Import',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1594976912810-85f096ec3f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    verified: true,
  },
  {
    id: 'base-2',
    author: TESTIMONIALS[1].author,
    role: TESTIMONIALS[1].role,
    quote: TESTIMONIALS[1].quote,
    rating: 5,
    date: '2026-07-02',
    service: 'Auction Bidding & Apapa Port Clearance',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    verified: true,
  },
  {
    id: 'base-3',
    author: TESTIMONIALS[2].author,
    role: TESTIMONIALS[2].role,
    quote: TESTIMONIALS[2].quote,
    rating: 5,
    date: '2026-07-28',
    service: 'Ford F-150 Installment Sourcing',
    mediaType: 'none',
    verified: true,
  },
];

interface ReviewsContextType {
  reviews: ReviewItem[];
  averageRating: number;
  totalCount: number;
  addReview: (review: Omit<ReviewItem, 'id' | 'date' | 'verified'>) => Promise<boolean>;
  exportToCSV: () => void;
  exportToJSON: () => void;
  isLoading: boolean;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

// Google Apps Script Webhook URL for LeeAutoX Verified Reviews Google Sheet
const GOOGLE_SCRIPT_WEBHOOK = ((import.meta as any).env?.VITE_GOOGLE_SHEETS_SCRIPT_URL as string) || 
  'https://script.google.com/macros/s/AKfycbxbeEOBjabzihD7O0E5HgMAqYCcCFQofwov6bimocrCIfpuBYNFjGhujQna0Y4IZY6bDQ/exec';

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem('leeautox_user_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge initial baseline with user saved reviews ensuring unique IDs
          const baseIds = new Set(INITIAL_REVIEWS.map(r => r.id));
          const filteredUserReviews = parsed.filter((r: ReviewItem) => !baseIds.has(r.id));
          return [...INITIAL_REVIEWS, ...filteredUserReviews];
        }
      }
    } catch (e) {
      console.warn('Could not read saved reviews from storage', e);
    }
    return INITIAL_REVIEWS;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync to local storage whenever user reviews change
  useEffect(() => {
    try {
      localStorage.setItem('leeautox_user_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.warn('Could not write reviews to storage', e);
    }
  }, [reviews]);

  // Calculate dynamic average star rating
  const totalCount = reviews.length;
  const averageRating = totalCount > 0
    ? Number((reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalCount).toFixed(1))
    : 5.0;

  const addReview = async (newReviewData: Omit<ReviewItem, 'id' | 'date' | 'verified'>): Promise<boolean> => {
    setIsLoading(true);
    const newReview: ReviewItem = {
      ...newReviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      date: new Date().toISOString().split('T')[0],
      verified: true,
    };

    // Append into state immediately (creates a new slide in the carousel)
    setReviews(prev => [...prev, newReview]);

    // If Google Sheet Webhook is configured, post in background
    if (GOOGLE_SCRIPT_WEBHOOK) {
      try {
        await fetch(GOOGLE_SCRIPT_WEBHOOK, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReview),
        });
      } catch (err) {
        console.warn('Google Sheet submission webhook error (handled safely):', err);
      }
    }

    setIsLoading(false);
    return true;
  };

  // Export Reviews as CSV (Ready for Google Business Profile verification & CRM upload)
  const exportToCSV = () => {
    const headers = ['ID', 'Author', 'Role/Location', 'Star Rating', 'Review Text', 'Service / Vehicle', 'Media Type', 'Media URL', 'Date', 'Verified'];
    const rows = reviews.map(r => [
      `"${r.id}"`,
      `"${r.author.replace(/"/g, '""')}"`,
      `"${r.role.replace(/"/g, '""')}"`,
      r.rating,
      `"${r.quote.replace(/"/g, '""')}"`,
      `"${(r.service || 'Automotive Import').replace(/"/g, '""')}"`,
      `"${r.mediaType || 'none'}"`,
      `"${r.mediaUrl || ''}"`,
      `"${r.date}"`,
      r.verified ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LeeAutoX_Google_Business_Reviews_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Reviews as structured JSON
  const exportToJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reviews, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `LeeAutoX_Reviews_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        averageRating,
        totalCount,
        addReview,
        exportToCSV,
        exportToJSON,
        isLoading,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
