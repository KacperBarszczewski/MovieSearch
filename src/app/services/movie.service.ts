import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../models/movie';
import { MovieSearchResponse } from '../models/movieSearchResponse';
import { BehaviorSubject, finalize, forkJoin, map, switchMap } from 'rxjs';
import { MovieState } from '../models/movieState';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  private movieStateSubject = new BehaviorSubject<MovieState>({
    loading: false,
    movies: [],
    numberOfMovies: 0,
    query: '',
    pageIndex: 1
  });

  movieState$ = this.movieStateSubject.asObservable();

  constructor(private http: HttpClient) { }

  searchMovies(query: string, page: number = 1): void {
    if (!query) return;

    this.movieStateSubject.next({
      ...this.movieStateSubject.value,
      loading: true,
      query,
      pageIndex: page
    });

    this.http.get<MovieSearchResponse>(`${this.apiUrl}?s=${query}&apikey=${this.apiKey}&page=${page}`).pipe(
      map(response => {
        this.movieStateSubject.next({ ...this.movieStateSubject.value, numberOfMovies: parseInt(response.totalResults) });
        return response.Search || []
      }),
      switchMap(movies => {
        const detailsRequests = movies.map(movie =>
          this.http.get<Movie>(`${this.apiUrl}?i=${movie.imdbID}&plot=full&apikey=${this.apiKey}`)
        );
        return forkJoin(detailsRequests);
      }),
      finalize(() => this.movieStateSubject.next({ ...this.movieStateSubject.value, loading: false }))
    ).subscribe(movies => this.movieStateSubject.next({ ...this.movieStateSubject.value, movies }));
  }

}


