import { Router } from 'express';
import * as chatController from '../controllers/chat.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { UserRole } from '../types';
import { startConversationSchema, sendMessageSchema } from '../validators/chat.validator';

const router = Router();

router.use(authenticate);

router.get('/unread-count', chatController.unreadCount);
router.get('/', chatController.list);
router.post(
  '/',
  authorize(UserRole.STUDENT, UserRole.COMPANY),
  validate(startConversationSchema),
  chatController.start
);
router.get('/:id/messages', chatController.messages);
router.post('/:id/messages', validate(sendMessageSchema), chatController.send);
router.patch('/:id/read', chatController.read);

export default router;
