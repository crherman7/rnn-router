/* eslint-disable turbo/no-undeclared-env-vars */

/**
 * Represents the application context module.
 * @type {__MetroModuleApi.RequireContext}
 */
export const ctx: __MetroModuleApi.RequireContext = require.context(
  /**
   * Root directory for context module
   *
   * @example
   * ```ts
   * app
   * ```
   */
  process.env.ROUTER_ROOT!,

  /**
   * Whether to include subdirectories
   *
   * @example
   * ```ts
   * // expected to be recursive
   *
   * true
   * ```
   */
  true,

  /**
   * Regular expression to match module files
   *
   * @example
   * ```ts
   * // matches any sequence of characters, including an empty string. It effectively matches any string or sequence of characters.
   *
   * .*
   * ```
   */
  /.*/,

  /**
   * Import mode for the context module
   *
   * @example
   * ```ts
   * "sync" | "eager" | "weak" | "lazy" | "lazy-once"
   * ```
   */
  process.env.IMPORT_MODE as any,
);
