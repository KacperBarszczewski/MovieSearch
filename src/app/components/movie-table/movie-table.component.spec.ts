import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { By } from "@angular/platform-browser";
import { BehaviorSubject, of } from "rxjs";
import { MovieState } from "../../models/movieState";
import { MovieService } from "../../services/movie.service";
import { MovieTableComponent } from "./movie-table.component";


describe('MovieTableComponent', () => {
  let component: MovieTableComponent;
  let fixture: ComponentFixture<MovieTableComponent>;
  let movieServiceMock: jasmine.SpyObj<MovieService>;
  let movieStateSubject: BehaviorSubject<MovieState>;
  
  const mockMovieState: MovieState = {
    loading: false,
    movies: [{ Title: 'Test Title', Year: '1234', Genre: 'Test Genre', Director: 'Test Director', Runtime: '123 min', Plot: 'Test Plot', Poster: 'https://test.com/test.jpg' }],
    numberOfMovies: 1,
    query: 'Test title',
    pageIndex: 1,
  };

  beforeEach(() => {
    movieServiceMock = jasmine.createSpyObj('MovieService', ['searchMovies','updateMovieState']);
    movieStateSubject = new BehaviorSubject<MovieState>(mockMovieState);
    movieServiceMock.updateMovieState.and.callFake((newState: MovieState) => {
      movieStateSubject.next(newState);
    });
    movieServiceMock.movieState$ = movieStateSubject.asObservable();

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        DragDropModule,
        ReactiveFormsModule,
        MovieTableComponent
      ],
      providers: [
        { provide: MovieService, useValue: movieServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieTableComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display movie data in the table', () => {
    const tableRows = fixture.debugElement.nativeElement.querySelectorAll('tr.mat-mdc-row');
    expect(tableRows.length).toBeGreaterThan(0);

    const firstRow = tableRows[0];
    expect(firstRow.textContent).toContain(mockMovieState.movies[0].Title);
    expect(firstRow.textContent).toContain(mockMovieState.movies[0].Year);
    expect(firstRow.textContent).toContain(mockMovieState.movies[0].Genre);
  });

  it('should call searchMovies on page change', () => {
    const paginator = fixture.debugElement.query(By.directive(MatPaginator)).componentInstance;
    const pageChangeEvent = { pageIndex: 1, pageSize: 10, length: 1 };
    paginator.page.emit(pageChangeEvent);

    expect(movieServiceMock.searchMovies).toHaveBeenCalledWith(mockMovieState.query, 2);
  });

  it('should update the data source when movieState$ changes', async () => {
    const newMovieState: MovieState = {
      ...mockMovieState,
      movies: [{ Title: 'Test Title2', Year: '4321', Genre: 'Test Genre2', Director: 'Test Director2', Runtime: '321 min', Plot: 'Test Plot2', Poster: 'https://test.com/test2.jpg' }]
    };

    movieServiceMock.updateMovieState(newMovieState);

    fixture.detectChanges();
    await fixture.whenStable();

    const tableRows = fixture.debugElement.nativeElement.querySelectorAll('tr.mat-mdc-row');
    expect(tableRows.length).toBeGreaterThan(0);
    expect(tableRows[0].textContent).toContain('Test Title2');
  });

});
