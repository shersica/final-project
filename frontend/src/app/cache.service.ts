import { Injectable } from "@angular/core";

@Injectable()
export class CacheService {
    private cache: Map<string, any> = new Map()

    put(url: string, response: any): void {
        // console.log('cache miss', url);
        this.cache.set(url, response);
      }
    
      get(url: string): any {
        // console.log('cache hit', url);
        return this.cache.get(url);
      }
    
    //   clear(): void {
    //     this.cache.clear();
    //   }

      clear(url?: string): void {
        if (url) {
            console.log('Clearing cache for URL:', url);
            this.cache.delete(url);
        } else {
            console.log('Clearing entire cache');
            this.cache.clear();
        }
    }
}