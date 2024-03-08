import {ctx} from './ctx';
import {RouterManager} from './lib';

/**
 * Add routes to RouterManager using modules from ctx.
 * @param {string} routePath - The route path to be added.
 * @param {Function} routeHandler - The handler function for the route.
 */
function addRouteToRouter(routePath: string, routeHandler: any) {
  // Adding a route to the shared RouterManager instance
  RouterManager.shared.addRoute(routePath, routeHandler);
}

// Get all keys from the ctx module and iterate through them
ctx.keys().forEach(it => {
  // Get the default export from each module and add it as a route to the RouterManager
  const routePath = it; // The route path is the key itself
  const routeHandler = ctx(it).default; // The route handler is the default export of the module

  // Add the route to RouterManager
  addRouteToRouter(routePath, routeHandler);
});
