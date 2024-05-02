import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { TokenService } from './token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.tokenService.getToken();
    if (token) {
      const headers = req.headers.set('Authorization', `Bearer ${token}`);
      const authReq = req.clone({ headers });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
