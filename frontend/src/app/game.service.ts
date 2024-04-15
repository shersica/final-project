import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, lastValueFrom } from "rxjs";
import { Game, GameDetails } from "./models";

@Injectable()
export class GameService {

    private http = inject(HttpClient)

    baseUrl = 'http://localhost:8080'


    searchGames(query : string): Promise<Game[]>{
        const params = new HttpParams()
            .set('query', query)
        return lastValueFrom(this.http.get<Game[]>('/api/games', {params}))
    }

    getGameById(gameId : number): Observable<any> {

        return this.http.get<GameDetails>(`/api/games/${gameId}`)

    }

    discoverGames(orderBy : string, page : number): Promise<Game[]>{
        const params = new HttpParams()
            .set('orderBy', orderBy)
            .set('page', page)
        return lastValueFrom(this.http.get<Game[]>('/api/games/discover', {params}))
    }
}