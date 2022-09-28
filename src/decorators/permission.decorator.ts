import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

// export const Permissions = createParamDecorator(
//   (data: string, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     const user = request.user;
//     return data ? user?.[data] : user;
//   },
// );

export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

// permissions format: code:actionKey
export const PermissionProcess = (permissions: string) =>
  SetMetadata('permissionProcess', permissions);
