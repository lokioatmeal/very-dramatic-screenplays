/**
 * API Client for Frontend
 * 
 * Handles communication between the UI and the Vercel API endpoint.
 */

export interface ScreenplayInput {
  protagonistName: string;
  setting: string;
  season: string;
  romanticInterest: string;
  adultThemed: boolean;
}

export interface ScreenplayOutput {
  title: string;
  content: string;
}

/**
 * Calls the backend API to generate a screenplay
 * 
 * Falls back to mock generator if API is unavailable (for development)
 */
export async function generateScreenplay(input: ScreenplayInput): Promise<ScreenplayOutput> {
  try {
    // Determine API endpoint
    const apiBase = import.meta.env.VITE_API_BASE ?? 'https://very-dramatic-screenplays.vercel.app';

    const apiUrl = `${apiBase}/api/generate`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      // Try to parse JSON error; fall back to text
      let message = 'Failed to generate story';
      try {
        const error = await response.json();
        message = error.error || message;
      } catch (err) {
        const text = await response.text();
        message = text || message;
      }
      throw new Error(message);
    }

    const screenplay: ScreenplayOutput = await response.json();
    return screenplay;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
