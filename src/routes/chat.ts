import { Router } from 'express';
import { chat } from '../controllers/chat';

const chatRouter = Router();

chatRouter.post('/chat', chat);

export default chatRouter;