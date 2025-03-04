import { Component } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-movie-search',
  imports: [],
  templateUrl: './movie-search.component.html'
})
export class MovieSearchComponent {
  private searchSubject = new Subject<string>();

  constructor(private readonly movieService: MovieService) { }

  ngAfterViewInit() {
    this.searchSubject.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe(query => {
      this.movieService.searchMovies(query);
    });
  }

  onSearch(event: any): void {
    this.searchSubject.next(event.target.value.trim());
  }
}
