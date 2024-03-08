import type {URLContext} from './contexts';

/**
 * Parses search parameters from a URL string and returns them as key-value pairs in an object.
 * @param {string} url - The URL string containing search parameters.
 * @returns {Record<string, string>} - An object containing search parameters as key-value pairs.
 */
function getSearchParamFromURL(url: string): Record<string, string> {
  // Regular expression to match search parameters in the URL
  const regex = /[?&]([^=#]+)=([^&#]*)/g;

  // Object to store search parameters
  const params: Record<string, string> = {};

  // Variable to store each match found by regex
  let match: RegExpExecArray | null;

  // Loop through all matches found in the URL
  while ((match = regex.exec(url)) !== null) {
    // Extract parameter name and value from the match
    const paramName = match[1];
    const paramValue = match[2];

    // If both name and value are found, add them to the params object
    if (paramName && paramValue) {
      params[paramName] = paramValue;
    }
  }

  // Return the object containing search parameters
  return params;
}

/**
 * Parses a URL and extracts relevant information into a URLContext object.
 * @param {string} url - The URL to parse.
 * @param {string} route - The route associated with the URL.
 * @returns {URLContext} The parsed URL context object.
 */
export function parseURL(
  url: string | undefined,
  pathParams: object | undefined,
): URLContext | undefined {
  if (!url || !pathParams) {
    return undefined;
  }

  // Extract relevant information and construct the URLContext object
  return {
    url, // Assign the original URL
    pathParams, // Assign the route
    queryParams: getSearchParamFromURL(url), // Convert searchParams to object
  };
}
