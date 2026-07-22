import { Router } from 'express';
import { createRole, listRoles, getRole, updateRole, deleteRole, listPermissions } from '../controllers/roles';
import { authorization } from '../middlewares/authorization';
import { PERMISSIONS } from '../constants';

const router = Router();

router.post('/roles', authorization(PERMISSIONS.ROLES.EDIT), createRole)
router.get('/roles', authorization(PERMISSIONS.ROLES.READ), listRoles)
router.get('/roles/:id', authorization(PERMISSIONS.ROLES.READ), getRole)
router.put('/roles/:id', authorization(PERMISSIONS.ROLES.EDIT), updateRole)
router.delete('/roles/:id', authorization(PERMISSIONS.ROLES.EDIT), deleteRole)
router.get('/permissions', authorization(PERMISSIONS.ROLES.READ), listPermissions)

export default router