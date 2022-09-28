import { SetMetadata } from '@nestjs/common';
import { RoleType } from "../enum/role-type";

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
