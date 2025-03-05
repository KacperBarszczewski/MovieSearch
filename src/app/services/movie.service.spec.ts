import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { environment } from '../../environments/environment';
import { MovieSearchResponse } from '../models/movieSearchResponse';
import { Movie } from '../models/movie';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });   

  it('should search movies and update movieState', (done) => {
    const mockSearchResponse:MovieSearchResponse = {
      Search: [{ imdbID: 'tt1234567' }],
      totalResults: '1',
      Response: ''
    };

    const mockMovieDetails: Movie = {
      Title: 'Test Movie',
      Plot: 'Test plot',
      Poster: 'Test poster',
      Year: 'Test year',
      Runtime: 'Test runtime',
      Genre: 'Test genre',
      Director: 'Test director'
    };

    service.searchMovies('Test Movie');

    const searchReq = httpMock.expectOne(`${environment.apiUrl}?s=Test Movie&apikey=${environment.apiKey}&page=1`);
    expect(searchReq.request.method).toBe('GET');
    searchReq.flush(mockSearchResponse);

    const detailsReq = httpMock.expectOne(`${environment.apiUrl}?i=tt1234567&plot=full&apikey=${environment.apiKey}`);
    expect(detailsReq.request.method).toBe('GET');
    detailsReq.flush(mockMovieDetails);

    service.movieState$.subscribe(state => {
      expect(state.loading).toBeFalse();
      expect(state.movies.length).toBe(1);
      expect(state.movies[0]).toEqual(mockMovieDetails);
      expect(state.numberOfMovies).toBe(1);
      expect(state.query).toBe('Test Movie');
      expect(state.pageIndex).toBe(1);
      done();
    });
  });





});
