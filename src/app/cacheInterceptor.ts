import { HttpRequest, HttpResponse, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheService } from './cache.service';
import { Observable,  } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    constructor(private cacheService: HttpCacheService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('this is cache interceptor');

        if (req.url.indexOf('/LoginCustomer') < 0) {
            const cachedResponse = this.cacheService[req.urlWithParams] || null;

            if (cachedResponse) {
                console.log('response from cache');
                return cachedResponse;
            }

        }

        return next.handle(req).pipe(
            tap(event => {
              if (event instanceof HttpResponse) {
                this.cacheService[req.urlWithParams] = event;
                console.log('response from server');
              }
            })
          );
        /*return next.handle(req).do(event => {
            if (event instanceof HttpResponse) {
                this.cacheService[req.urlWithParams] = event;
                console.log('response from server');
            }
        });*/
    }
}
