import {Navigation, Options} from 'react-native-navigation';

import {useComponentId} from './contexts';
import {RouterManager} from './RouterManager';
import invariant from 'tiny-invariant';

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
   */
  const open = (path: string, passProps = {}) => {
    const route = RouterManager.shared.pathToRoute(path);

    if (/^Tab\d+/.test(route.name)) {
      const match = /\w+(\d+)/.exec(route.name);

      invariant(
        match?.[1] && typeof Number(match[1]) === 'number',
        `Cannot match tab index from route name: ${route}`,
      );

      return Navigation.mergeOptions(componentId, {
        bottomTabs: {
          currentTabIndex: Number(match[1]),
        },
      });
    }

    push(path, passProps);
  };

  /**
   * Navigates to a new screen.
   * @param {string} path - The path or route to navigate to.
   */
  const push = (path: string, passProps = {}) => {
    const route = RouterManager.shared.pathToRoute(path);

    Navigation.push(componentId, {
      component: {
        name: route.name,
        passProps: {
          ...passProps,
          __dangerously_access_url: path,
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
