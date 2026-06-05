// 路由注册
import { apiController } from '../controllers/api.controller.js';
import { Router } from '../../app/Router.js';

const apiRouter = new Router('/api');
apiRouter.get('/groups', apiController.listGroups);
apiRouter.get('/groups/:id', apiController.getGroup);
apiRouter.post('/groups/:id/batch', apiController.batchAction);
apiRouter.get('/timeline', apiController.timeline);
apiRouter.post('/inspector/:packId/apply-all', apiController.applyToAll);
apiRouter.delete('/packs/:packId', apiController.removePack);
apiRouter.get('/export/:groupId', apiController.exportConfig);

export { apiRouter };
