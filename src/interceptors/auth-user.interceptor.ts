import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from "../auth/auth.service";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const user = <User>request.user;
    AuthService.setAuthUser(user);

    return next.handle();
  }
}
