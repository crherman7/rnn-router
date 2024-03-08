import {uniqueId} from 'lodash';
import React, {Fragment} from 'react';
import {
  Navigation,
  type LayoutRoot,
  LayoutStack,
} from 'react-native-navigation';
import invariant from 'tiny-invariant';
import {MatchFunction, MatchResult, match} from 'path-to-regexp';

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

  protected registerTab(
    sanitizedRoute: string,
    Component: React.ComponentType<any>,
    Provider: React.ComponentType<any> = ({children}) => (
      <Fragment>{children}</Fragment>
    ),
  ) {
    // @ts-ignore
    const componentName = `Tab${Component.$$RNNRTypeIndex}`;

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

    this.layout = {
      root: {
        bottomTabs: {
          children: [
            ...this.layout.root.bottomTabs!.children!,
            {stack: bottomTab},
          ].sort((a, b) => {
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

    this.registerComponent(sanitizedRoute, componentName, Component, Provider);
  }

  protected registerComponent(
    sanitizedRoute: string,
    componentName: string,
    Component: React.ComponentType<any>,
    Provider: React.ComponentType<any>,
  ) {
    this.routes.push({
      sanitizedRoute,
      name: componentName,
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

  addRoute(route: string, Component: React.ComponentType<any>) {
    const sanitizedRoute = this.sanitizeRoute(route);

    // @ts-ignore
    if (Component.$$RNNRType === 'Screen') {
      this.registerScreen(sanitizedRoute, Component, ({children}) => (
        <Fragment>{children}</Fragment>
      ));

      return;
    }

    // @ts-ignore
    if (Component.$$RNNRType === 'Tab') {
      this.registerTab(sanitizedRoute, Component, ({children}) => (
        <Fragment>{children}</Fragment>
      ));

      return;
    }

    throw Error(
      'Route is not defined as a Screen or Tab. Please utilize `makeScreen` and `makeTab` for route components.',
    );
  }

  pathToRoute(path: string) {
    const pathWithoutSearch = path.split('?')[0];
    const matchedRoute = this.routes.find(it => it.fn(pathWithoutSearch!));

    invariant(matchedRoute, `Cannot find route that matches path: ${path}`);

    const match = matchedRoute.fn(pathWithoutSearch!) as MatchResult;

    return {
      ...match,
      name: matchedRoute.name,
    };
  }
}
