import invariant from 'tiny-invariant';
import {Navigation, type Options} from 'react-native-navigation';

import {useComponentId} from './contexts';
import {RouterManager} from './RouterManager';

/**
 * Custom hook for navigation functionalities.
 * @returns {object} An object containing navigation functions.
 */
export function useNavigator() {
  // Retrieve the componentId using the useComponentId hook from the context
  const [componentId] = useComponentId();

  /**
   * Navigates to a new screen or switches tab.
   * @param {string} path - The path or route to navigate to.
   * @param {Object} [passProps={}] - Additional props to pass to the target screen.
   */
  const open = (path: string, passProps = {}) => {
    // Retrieve the route object corresponding to the provided path
    const route = RouterManager.shared.pathToRoute(path);

    // Check if the route corresponds to a tab
    if (/^Tab\d+/.test(route.name)) {
      // Extract the tab index from the route name
      const match = /\w+(\d+)/.exec(route.name);

      // Ensure that the tab index is a valid number
      invariant(
        match?.[1] && typeof Number(match[1]) === 'number',
        `Cannot match tab index from route name: ${route}`,
      );

      // Switch to the tab with the extracted index
      return Navigation.mergeOptions(componentId, {
        bottomTabs: {
          currentTabIndex: Number(match[1]),
        },
      });
    }

    // If the route is not a tab, navigate to the specified path
    push(path, passProps);
  };

  /**
   * Navigates to a new screen.
   * @param {string} path - The path or route to navigate to.
   * @param {Object} [passProps={}] - Additional props to pass to the target screen.
   */
  const push = (path: string, passProps = {}) => {
    // Retrieve the route object corresponding to the provided path
    const route = RouterManager.shared.pathToRoute(path);

    // Push a new screen onto the navigation stack
    Navigation.push(componentId, {
      component: {
        // Set the name of the screen component based on the route name
        name: route.name,
        // Pass additional props to the target screen
        passProps: {
          // Spread existing passProps
          ...passProps,
          // Include the path as a dangerous prop for internal purposes
          __dangerously_access_url: path,
          // Include route parameters as a dangerous prop for internal purposes
          __dangerously_access_params: route.params,
        },
      },
    });
  };

  /**
   * Navigates back to the previous screen.
   */
  const pop = (mergeOptions?: Options) => {
    return Navigation.pop(componentId, mergeOptions);
  };

  /**
   * Navigates back to a specific screen identified by its componentId.
   * @param {string} targetComponentId - The componentId of the screen to navigate back to.
   */
  const popTo = (targetComponentId: string, mergeOptions?: Options) => {
    return Navigation.popTo(targetComponentId, mergeOptions);
  };

  /**
   * Navigates back to the root screen.
   */
  const popToRoot = (mergeOptions?: Options) => {
    return Navigation.popToRoot(componentId, mergeOptions);
  };

  /**
   * Shows a modal screen.
   */
  const showModal = () => {
    // Implement logic to show a modal screen
  };

  // Return an object containing all navigation functions
  return {
    open,
    push,
    pop,
    popTo,
    popToRoot,
    showModal,
  };
}
