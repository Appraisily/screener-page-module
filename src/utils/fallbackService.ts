/**
 * Fallback Service for Analysis Steps
 * 
 * This utility provides fallback mechanisms when analysis steps fail,
 * ensuring that users still receive useful results even when parts
 * of the analysis pipeline encounter errors.
 */

import type { SearchResults, DetailedAnalysis } from '../types';

/**
 * Generates a basic fallback detailed analysis
 * 
 * @param category Optional category from previous analysis steps
 * @param description Optional description from previous analysis steps
 * @returns A minimal but useful DetailedAnalysis
 */
export function createFallbackDetailedAnalysis(
  category?: string,
  description?: string
): DetailedAnalysis {
  const unknownMsg = 'Unable to determine due to analysis limitations';
  
  // Use any available prior information or fallback to generic values
  const analysisCategory = category || 'Unknown';
  const analysisDescription = description || 'Item';

  return {
    maker_analysis: {
      creator_name: 'Unknown',
      reasoning: 'We could not confidently identify the creator of this item during analysis.'
    },
    signature_check: {
      signature_text: 'No signature identified',
      interpretation: 'Without a clear signature or maker\'s mark, we cannot provide attribution information.'
    },
    origin_analysis: {
      likely_origin: unknownMsg,
      reasoning: 'Our analysis was unable to determine the origin of this item with sufficient confidence.'
    },
    marks_recognition: {
      marks_identified: 'No identifiable marks',
      interpretation: 'No distinctive marks were identified during our analysis.'
    },
    age_analysis: {
      estimated_date_range: 'Contemporary (estimated)',
      reasoning: 'Without specific markers of age, we estimate this is likely a contemporary item.'
    },
    visual_search: {
      similar_artworks: `Similar ${analysisCategory.toLowerCase()} items`,
      notes: `This appears to be a ${analysisDescription.toLowerCase()} that would benefit from in-person expert analysis.`
    }
  };
}

/**
 * Generates fallback metadata for search results
 * 
 * @param sessionId The session identifier
 * @param imageUrl URL of the customer's image
 * @param category Optional category if known
 * @param description Optional description if known
 * @returns Metadata object with fallback values
 */
export function createFallbackMetadata(
  sessionId: string,
  imageUrl: string,
  category?: string,
  description?: string
) {
  const now = Date.now();
  
  return {
    originalName: 'UserUploadedImage.jpeg',
    timestamp: now,
    analyzed: true,
    mimeType: 'image/jpeg',
    size: 0,
    fileName: 'UserUploadedImage.jpeg',
    imageUrl: imageUrl,
    analysisTimestamp: now,
    analysisResults: {
      labels: [],
      webEntities: 0,
      matchCounts: {
        exact: 0,
        partial: 0,
        similar: 0
      },
      pagesWithMatches: 0,
      webLabels: 0,
      openaiAnalysis: {
        category: category || 'Item',
        description: description || 'Unknown item'
      }
    },
    originAnalyzed: false,
    originAnalysisTimestamp: 0
  };
}

/**
 * Creates complete fallback search results
 * 
 * @param sessionId The session identifier
 * @param imageUrl URL of the customer's image
 * @param category Optional category if known
 * @param description Optional description if known
 * @returns Complete fallback SearchResults object
 */
export function createFallbackResults(
  sessionId: string,
  imageUrl: string,
  category?: string,
  description?: string
): SearchResults {
  return {
    metadata: createFallbackMetadata(sessionId, imageUrl, category, description),
    detailedAnalysis: createFallbackDetailedAnalysis(category, description)
  };
}

/**
 * Merges partial results with fallbacks to ensure complete results
 * 
 * @param partialResults The partial results obtained so far
 * @param sessionId The session identifier
 * @param imageUrl URL of the customer's image 
 * @returns Complete SearchResults with fallbacks for missing parts
 */
export function mergeWithFallbacks(
  partialResults: Partial<SearchResults>,
  sessionId: string,
  imageUrl: string
): SearchResults {
  // Create fallback results as a base
  const fallbackResults = createFallbackResults(
    sessionId,
    imageUrl,
    partialResults?.metadata?.analysisResults?.openaiAnalysis?.category,
    partialResults?.metadata?.analysisResults?.openaiAnalysis?.description
  );
  
  // Merge metadata if available
  const mergedMetadata = partialResults.metadata
    ? { ...fallbackResults.metadata, ...partialResults.metadata }
    : fallbackResults.metadata;
  
  // Merge detailed analysis if available
  const mergedDetailedAnalysis = partialResults.detailedAnalysis
    ? { ...fallbackResults.detailedAnalysis, ...partialResults.detailedAnalysis }
    : fallbackResults.detailedAnalysis;
  
  return {
    metadata: mergedMetadata,
    detailedAnalysis: mergedDetailedAnalysis
  };
}