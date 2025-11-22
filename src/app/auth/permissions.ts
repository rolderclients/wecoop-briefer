import { createAccessControl } from 'better-auth/plugins/access';
import {
	adminAc,
	defaultStatements,
	userAc,
} from 'better-auth/plugins/admin/access';

export const ac = createAccessControl(defaultStatements);

const admin = ac.newRole(adminAc.statements);
const manager = ac.newRole(userAc.statements);

export const roles = { admin, manager };
