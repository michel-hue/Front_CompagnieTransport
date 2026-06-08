import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../public/environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const apiKey = environment.API_KEY;

  if (!apiKey) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      'X-API-Key': apiKey,
    },
  });

  return next(cloned);
};

