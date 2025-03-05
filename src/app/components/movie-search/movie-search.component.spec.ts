import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MovieService } from "../../services/movie.service";
import { MovieSearchComponent } from "./movie-search.component";


describe('MovieSearchComponent', () => {
  let component: MovieSearchComponent;
  let fixture: ComponentFixture<MovieSearchComponent>;
  let movieServiceMock: jasmine.SpyObj<MovieService>;

  beforeEach(() => {
    movieServiceMock = jasmine.createSpyObj('MovieService', ['searchMovies']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MovieSearchComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceMock }
      ]
    });

    fixture = TestBed.createComponent(MovieSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchMovies when search control value changes after debounce', fakeAsync(() => {
    component.searchControl.setValue('Test');

    expect(movieServiceMock.searchMovies).not.toHaveBeenCalled();

    tick(800);

    expect(movieServiceMock.searchMovies).toHaveBeenCalledWith('Test', 1);
  }));

  it('should not call searchMovies if the value does not change', fakeAsync(() => {
    component.searchControl.setValue('Test');
    tick(800);

    component.searchControl.setValue('Test');
    tick(800);

    expect(movieServiceMock.searchMovies).toHaveBeenCalledTimes(1);
  }));

  it('should not call searchMovies if searchControl is empty', fakeAsync(() => {
    component.searchControl.setValue('');
    tick(800);

    expect(movieServiceMock.searchMovies).not.toHaveBeenCalled();
  }));
});
