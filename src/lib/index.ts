/**
 * Provides utility functionality for the rnn-router library.
 * @module lib
 */

/**
 * Provides additional utilities for URLs, such as aggregating search parameters.
 * @module lib/url
 */
export * from './url';

/**
 * Offers methods to create simple state contexts and provides hooks and providers for URL and ComponentId.
 * @module lib/contexts
 */
export * from './contexts';

/**
 * Helps create Screens, Tabs, and Modals for rnn-router to register these assets correctly with react-native-navigation.
 * @module lib/factories
 */
export * from './factories';

/**
 * Provides methods to navigate and interact with react-native-navigation's navigating actions.
 * @module lib/navigator
 */
export * from './navigator';

/**
 * Acts as an interface to React Native Navigation, registering components, tabs, and modals, and caching those routes.
 * @module lib/RouterManager
 */
export * from './RouterManager';
