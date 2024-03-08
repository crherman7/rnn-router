import {ctx} from './ctx';
import {RouterManager} from './lib';

ctx.keys().forEach(it => {
  RouterManager.shared.addRoute(it, ctx(it).default);
});
