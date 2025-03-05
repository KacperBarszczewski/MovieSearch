import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { MovieSearchComponent } from '../../components/movie-search/movie-search.component';
import { MovieTableComponent } from '../../components/movie-table/movie-table.component';
import { MovieService } from '../../services/movie.service';
import { MovieState } from '../../models/movieState';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let movieServiceMock: jasmine.SpyObj<MovieService>;

  const loadedState: MovieState = {
    loading: false,
    movies: [{ Title: 'Test Title', Year: '1234', Genre: 'Test Genre', Director: 'Test Director', Runtime: '123 min', Plot: 'Test Plot', Poster: 'https://test.com/test.jpg' }],
    numberOfMovies: 1,
    query: 'Test title',
    pageIndex: 1,
  };

  const loadingState: MovieState = {
    loading: true,
    movies: [],
    numberOfMovies: 0,
    query: '',
    pageIndex: 1,
  };


  beforeEach(async () => {
    movieServiceMock = jasmine.createSpyObj('MovieService', ['searchMovies', 'updateMovieState']);
    movieServiceMock.movieState$ = of(loadedState);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, MovieSearchComponent, MovieTableComponent, CommonModule],
      providers: [
        { provide: MovieService, useValue: movieServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner while loading', () => {
    movieServiceMock.updateMovieState(loadingState);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('svg'));
    expect(spinner).toBeTruthy();
  });

  it('should show movie table when movies are loaded', async () => {
    movieServiceMock.updateMovieState(loadedState);

    fixture.detectChanges();
    await fixture.whenStable();

    const movieTable = fixture.debugElement.query(By.css('app-movie-table'));
    expect(movieTable).toBeTruthy();
  });



});
