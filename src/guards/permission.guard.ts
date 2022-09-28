import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from "../users/entities/user.entity";


@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // public readonly permissionActiveRepo: PermissionActiveRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    return true;
  }
}

@Injectable()
export class PermissionProcessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string>(
      'permissionProcess',
      context.getHandler(),
    );
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    return true;
  }
}
