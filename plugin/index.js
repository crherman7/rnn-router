const path = require('path');
const resolveFrom = require('resolve-from');

function getRouterRoot(projectRoot, appDirectory) {
  const entryPath = resolveFrom.silent(projectRoot, 'rnn-router/ctx');

  const routerRoot = path.relative(
    path.dirname(entryPath),
    path.join(projectRoot, appDirectory),
  );

  return routerRoot;
}

module.exports = function routerPlugin({types: t}) {
  return {
    visitor: {
      MemberExpression(p, s) {
        if (
          !t.isIdentifier(p.node.object, {name: 'process'}) ||
          !t.isIdentifier(p.node.property, {name: 'env'})
        ) {
          return;
        }

        const parent = p.parentPath;
        if (!t.isMemberExpression(parent.node)) {
          return;
        }

        const appDirectory = s.opts.appDirectory || 'app';
        const importMode = s.opts.importMode || 'sync';
        const root = s.file.opts.root || '';

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
