import { Router } from 'express';
import { listUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/users';
import { authorization } from '../middlewares/authorization';
import { PERMISSIONS } from '../constants';

const router = Router();

router.get('/users', authorization(PERMISSIONS.USERS.READ), listUsers)
router.get('/users/:id', authorization(PERMISSIONS.USERS.READ), getUser)
router.post('/users', authorization(PERMISSIONS.USERS.EDIT), createUser)
router.put('/users/:id', authorization(PERMISSIONS.USERS.EDIT), updateUser)
router.delete('/users/:id', authorization(PERMISSIONS.USERS.EDIT), deleteUser)

export default router;