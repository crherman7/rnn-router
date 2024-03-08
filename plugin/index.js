const path = require('path');
const resolveFrom = require('resolve-from');

/**
 * Calculates the root directory for the router configuration.
 * @param {string} projectRoot - The root directory of the project.
 * @param {string} appDirectory - The directory where the app resides.
 * @returns {string} - The root directory for the router configuration.
 */
function getRouterRoot(projectRoot, appDirectory) {
  // Attempt to resolve the entry path for the router context
  const entryPath = resolveFrom.silent(projectRoot, 'rnn-router/ctx');

  // Calculate the relative path from the directory of entryPath to the app directory
  const routerRoot = path.relative(
    path.dirname(entryPath),
    path.join(projectRoot, appDirectory),
  );

  return routerRoot;
}

/**
 * A Babel plugin that replaces process.env.ROUTER_ROOT and process.env.IMPORT_MODE
 * with their respective values.
 * @param {Object} api - Babel API object.
 * @returns {Object} - Babel visitor object.
 */
module.exports = function routerPlugin({types: t}) {
  return {
    visitor: {
      /**
       * Visitor for MemberExpression nodes.
       * @param {Object} p - Babel path object.
       * @param {Object} s - Babel state object.
       */
      MemberExpression(p, s) {
        // Check if the MemberExpression is accessing process.env
        if (
          !t.isIdentifier(p.node.object, {name: 'process'}) ||
          !t.isIdentifier(p.node.property, {name: 'env'})
        ) {
          return;
        }

        const parent = p.parentPath;

        // Ensure that the MemberExpression has a parent MemberExpression
        if (!t.isMemberExpression(parent.node)) {
          return;
        }

        // Get options from Babel state or use defaults
        const appDirectory = s.opts.appDirectory || 'app';
        const importMode = s.opts.importMode || 'sync';
        const root = s.file.opts.root || '';

        // Replace process.env.ROUTER_ROOT with the calculated router root
        if (
          t.isIdentifier(parent.node.property, {
            name: 'ROUTER_ROOT',
          }) &&
          !parent.parentPath.isAssignmentExpression()
        ) {
          parent.replaceWith(
            t.stringLiteral(getRouterRoot(root, appDirectory)),
          );
        }

        // Replace process.env.IMPORT_MODE with the configured import mode
        if (
          t.isIdentifier(parent.node.property, {
            name: 'IMPORT_MODE',
          }) &&
          !parent.parentPath.isAssignmentExpression()
        ) {
          parent.replaceWith(t.stringLiteral(importMode));
        }
      },
    },
  };
};
