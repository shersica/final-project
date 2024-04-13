import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthenticationService{

    private http = inject(HttpClient)

    baseUrl = 'http://localhost:8080'


    register(user: any): Observable<any>{
        return this.http.post('/api/auth/register', user)
    }

    login(user: any): Observable<any>{
        return this.http.post('/api/auth/login', user)
    }
}