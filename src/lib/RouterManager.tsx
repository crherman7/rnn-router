import {uniqueId} from 'lodash';
import React, {Fragment} from 'react';
import {
  Navigation,
  type LayoutRoot,
  type LayoutStack,
} from 'react-native-navigation';
import invariant from 'tiny-invariant';
import {type MatchFunction, match} from 'path-to-regexp';

import {parseURL} from './url';
import {ComponentIdProvider, URLProvider} from './contexts';

/**
 * Class representing a Router Manager.
 */
export class RouterManager {
  private static instance: RouterManager;
  /**
   * Gets the shared instance of RouterManager.
   * @static
   * @returns {RouterManager} The shared instance of RouterManager.
   */
  static get shared(): RouterManager {
    if (!RouterManager.instance) {
      RouterManager.instance = new RouterManager();
    }

    return RouterManager.instance;
  }

  /**
   * Creates an instance of RouterManager.
   * @throws {Error} Throws an error if RouterManager was already instantiated.
   */
  protected constructor() {
    if (RouterManager.instance) {
      throw new Error(
        'RouterManager was already instantiated. Use RouterManager.shared instead.',
      );
    }

    // Register an event listener for when the app is launched
    Navigation.events().registerAppLaunchedListener(() => {
      // Set the root layout for navigation when the app is launched
      Navigation.setRoot(this.layout);
    });
  }

  /**
   * Object containing route mappings.
   * @protected
   * @type {Record<string, string>}
   */
  protected routes: Array<{
    sanitizedRoute: string;
    name: string;
    fn: MatchFunction;
  }> = [];

  /**
   * Object containing the React Native Navigation layout
   * @protected
   * @type {Layout}
   */
  protected layout: LayoutRoot = {
    root: {
      bottomTabs: {
        children: [],
      },
    },
  };

  /**
   * A mapping of React component types to modal identifiers.
   * @type {WeakMap<React.ComponentType<any>, string>}
   * @protected
   */
  protected modals: WeakMap<React.ComponentType<any>, string> = new WeakMap();

  /**
   * Sanitizes a route string by removing unnecessary parts and replacing dynamic segments.
   * @param {string} route - The route string to be sanitized.
   * @returns {string} The sanitized route string.
   *
   * @example
   * ```typescript
   * // Returns '/user/:id' when route is '/user/[id].tsx'
   *
   * sanitizeRoute('/user/[id].tsx');
   * ```
   */
  protected sanitizeRoute(route: string): string {
    // Remove leading '.' for relative path
    const path = route
      .replace(/^\./, '')
      // Remove 'index', and '.tsx' from the route string
      .replace(/index|\.tsx$/g, '')
      // Replace any occurrence of '[...params]' with '*'
      .replace(/\[\.{3}.+\]/, '*')
      // Replace any occurrence of '[param]' with ':param'
      .replace(/\[(.+)\]/, ':$1');

    return path;
  }

  /**
   * Registers a route with its associated component and provider.
   * @param {string} route - The route to register.
   * @param {React.ComponentType<any>} Component - The React component to be rendered for the route.
   * @param {React.ComponentType<any>} Provider - The provider component wrapping the route's component.
   */
  protected registerScreen(
    sanitizedRoute: string,
    Component: React.ComponentType<any>,
    Provider: React.ComponentType<any> = ({children}) => (
      <Fragment>{children}</Fragment>
    ),
  ) {
    // Generate a unique component name for the route
    const componentName = uniqueId('Screen');

    this.registerComponent(sanitizedRoute, componentName, Component, Provider);
  }

  protected registerModal() {
    // const componentName = uniqueId('Modal');
  }

  /**
   * Registers a tab with the router.
   * @param {string} sanitizedRoute - The sanitized route path.
   * @param {React.ComponentType<any>} Component - The React component associated with the tab.
   * @param {React.ComponentType<any>} [Provider=({children}) => (<Fragment>{children}</Fragment>)] - The provider component wrapping the registered tab component.
   */
  protected registerTab(
    sanitizedRoute: string,
    Component: React.ComponentType<any>,
    Provider: React.ComponentType<any> = ({children}) => (
      <Fragment>{children}</Fragment>
    ),
  ) {
    // Generate the component name for the tab
    // @ts-ignore
    const componentName = `Tab${Component.$$RNNRTypeIndex}`;

    // Define the layout for the tab
    const bottomTab: LayoutStack = {
      children: [
        {
          component: {
            name: componentName,
          },
        },
      ],
      options: {
        // @ts-ignore
        bottomTab: Component.$$RNNRTypeOptions,
      },
    };

    // Update the layout with the new tab
    this.layout = {
      root: {
        bottomTabs: {
          children: [
            ...this.layout.root.bottomTabs!.children!,
            {stack: bottomTab},
          ].sort((a, b) => {
            // Sort the tabs alphabetically by component name
            invariant(
              a.stack?.children?.[0]?.component?.name &&
                typeof a.stack.children[0].component.name === 'string',
            );
            invariant(
              b.stack?.children?.[0]?.component?.name &&
                typeof b.stack.children[0].component.name === 'string',
            );

            return a.stack.children[0].component.name.localeCompare(
              b.stack.children[0].component.name,
            );
          }),
        },
      },
    };

    // Register the tab component
    this.registerComponent(sanitizedRoute, componentName, Component, Provider);
  }

  /**
   * Registers a component with the router and React Native Navigation.
   * @param {string} sanitizedRoute - The sanitized route path.
   * @param {string} componentName - The name of the component.
   * @param {React.ComponentType<any>} Component - The React component to be registered.
   * @param {React.ComponentType<any>} Provider - The provider component wrapping the registered component.
   */
  protected registerComponent(
    sanitizedRoute: string,
    componentName: string,
    Component: React.ComponentType<any>,
    Provider: React.ComponentType<any>,
  ) {
    // Push the route information to the routes array
    this.routes.push({
      sanitizedRoute,
      name: componentName,
      // Function to match the route using sanitizedRoute and decodeURIComponent
      fn: match(sanitizedRoute, {decode: decodeURIComponent}),
    });

    // Register the component with React Native Navigation
    Navigation.registerComponent(
      componentName,
      // Component wrapper function
      () => props => {
        // Extract URL and route information from props
        const {
          __dangerously_access_url,
          __dangerously_access_params,
          ...passProps
        } = props;

        // Parse URL into URLContext object
        const url = parseURL(
          __dangerously_access_url,
          __dangerously_access_params,
        );

        // Render the component within the provider hierarchy
        return (
          <Provider>
            <URLProvider initialValue={url}>
              <ComponentIdProvider initialValue={props.componentId}>
                <Component {...passProps} />
              </ComponentIdProvider>
            </URLProvider>
          </Provider>
        );
      },
      // Original component to be registered
      () => Component,
    );
    // this will contain shared logic of registering a screen and tab
  }

  /**
   * Adds a route to the router.
   * @param {string} route - The route path.
   * @param {React.ComponentType<any>} Component - The React component associated with the route.
   */
  addRoute(route: string, Component: React.ComponentType<any>) {
    // Sanitize the route
    const sanitizedRoute = this.sanitizeRoute(route);

    // Check if the component is a Screen
    // @ts-ignore
    if (Component.$$RNNRType === 'Screen') {
      // Register the Screen component
      return this.registerScreen(sanitizedRoute, Component, ({children}) => (
        <Fragment>{children}</Fragment>
      ));
    }

    // Check if the component is a Tab
    // @ts-ignore
    if (Component.$$RNNRType === 'Tab') {
      // Register the Tab component
      return this.registerTab(sanitizedRoute, Component, ({children}) => (
        <Fragment>{children}</Fragment>
      ));
    }

    // If the component is neither a Screen nor a Tab, throw an error
    throw Error(
      'Route is not defined as a Screen or Tab. Please utilize `makeScreen` and `makeTab` for route components.',
    );
  }

  /**
   * Resolves a path to a route object.
   * @param {string} path - The path to resolve to a route object.
   * @returns {RouteObject} - The resolved route object.
   */
  pathToRoute(path: string) {
    // Extract the path without the search query
    const pathWithoutSearch = path.split('?')[0];

    // type-guard pathWithoutSearch to be a string
    invariant(
      pathWithoutSearch,
      `Failed to parse URL from searchParams: ${path}`,
    );

    // Find the route that matches the given path
    const matchedRoute = this.routes.find(route => route.fn(pathWithoutSearch));

    // Ensure that a matching route is found, otherwise throw an error
    invariant(matchedRoute, `Cannot find route that matches path: ${path}`);

    // Extract the match result using the matched route's function
    const match = matchedRoute.fn(pathWithoutSearch);

    // Return the route object with additional properties
    return {
      ...match, // Include match result properties
      name: matchedRoute.name, // Set the name property to the matched route's name
    };
  }
}
