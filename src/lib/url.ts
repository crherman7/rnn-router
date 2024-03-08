import type {URLContext} from './contexts';

/**
 * Converts a URLSearchParams object to a JavaScript object.
 * @param {URLSearchParams} urlSearchParams - The URLSearchParams object to convert.
 * @returns {Record<string, string | string[]>} A JavaScript object representing the URLSearchParams.
 */
function getSearchParamFromURL(url: string): Record<string, string> {
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params: Record<string, string> = {};
  let match: RegExpExecArray | null;

  while ((match = regex.exec(url)) !== null) {
    const paramName = match[1];
    const paramValue = match[2];

    if (paramName && paramValue) {
      params[paramName] = paramValue;
    }
  }

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
