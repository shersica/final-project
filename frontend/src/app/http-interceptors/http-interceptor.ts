import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, of, tap } from "rxjs";
import { CacheService } from "../cache.service";

@Injectable()
export class CacheInterceptor implements HttpInterceptor{

    private cacheSvc = inject(CacheService)

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.method !== 'GET') {
          return next.handle(request);
        }
    
        // const cacheResponse = this.cacheSvc.get(request.urlWithParams);
        // if (cacheResponse) {
        //   return of(cacheResponse);
        // }
        
        // return next.handle(request).pipe(
        //   tap((event: HttpEvent<any>) => {
        //     if (event.type === HttpEventType.Response) {
        //       this.cacheSvc.put(request.urlWithParams, event);
        //     }
        //   })
        // );
        const cacheKey = request.urlWithParams; // Use the complete URL as cache key

        const cacheResponse = this.cacheSvc.get(cacheKey);
        if (cacheResponse) {
          return of(cacheResponse);
        }
        
        return next.handle(request).pipe(
          tap((event: HttpEvent<any>) => {
            if (event.type === HttpEventType.Response) {
              this.cacheSvc.put(cacheKey, event); // Cache the response with complete URL as key
            }
          })
        );
      }
}