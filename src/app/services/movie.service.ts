import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../models/movie';
import { MovieSearchResponse } from '../models/movieSearchResponse';
import { BehaviorSubject, finalize, forkJoin, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://omdbapi.com/';
  private apiKey = 'd93c68b3';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  movies$ = this.moviesSubject.asObservable();

  private numberMovesSubject = new BehaviorSubject<number>(0);
  numberMoves$ = this.numberMovesSubject.asObservable();

  constructor(private http: HttpClient) { }

  searchMovies(query: string): void {
    if (!query) return;

    this.loadingSubject.next(true);
    this.http.get<MovieSearchResponse>(`${this.apiUrl}?s=${query}&apikey=${this.apiKey}`).pipe(
      map(response =>{
        this.numberMovesSubject.next(parseInt(response.totalResults));
        return response.Search || []
      } ),
      switchMap(movies => {
        console.log(movies);
        const detailsRequests = movies.map(movie =>
          this.http.get<Movie>(`${this.apiUrl}?i=${movie.imdbID}&plot=full&apikey=${this.apiKey}`)
        );
        return forkJoin(detailsRequests);
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(movies => this.moviesSubject.next(movies));
  }

}


