import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService, private router: Router, private jwtHelper: JwtHelperService) {}

  private publicUrls: string[] = [
    '/auth/signUp',
    '/auth/login',
    '/ubicaciones',
    '/hoteles/dynamicFilterAnd',
    '/habitaciones/dynamicFilterAnd',
    '/habitaciones/'
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();

    if (this.isPublicUrl(req.url)) {
      return next.handle(req); // Continuar sin autenticación
    }

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      // Token válido, agregarlo a los encabezados de autorización
      const headers = req.headers.set('Authorization', `Bearer ${token}`);
      const authReq = req.clone({ headers });
      return next.handle(authReq);
    } else {
      // Token inválido o no disponible, redirigir al login
      console.log(req.url)
      console.log("NO TENGO TOKEN");
      this.router.navigate(['/auth/login']);
      return next.handle(req);
    }
  }

  private isPublicUrl(url: string): boolean {
    return this.publicUrls.some(publicUrl => url.includes(publicUrl));
  }

}
