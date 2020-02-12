import { Injectable } from '@angular/core';
import { Hero} from '../model/hero';
import { Observable, of} from 'rxjs';
import { MessageService} from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }
  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  getHero(id: number): Observable<Hero> {
   const url = `${this.heroesUrl}/${id}`;
   return this.http.get<Hero>(url).pipe(
     catchError(this.handleError<Hero>(`getHero id=${id}`))
   );
  }
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('updateHero'))
      );
  }
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      catchError(this.handleError<Hero>('addHero'))
    );
  }
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  searchHeroes(term: string): Observable<Hero[]>{
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

}
