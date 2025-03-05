import { Component } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-search',
  imports: [ReactiveFormsModule],
  templateUrl: './movie-search.component.html'
})
export class MovieSearchComponent {
  searchControl = new FormControl('');

  constructor(private readonly movieService: MovieService) {
    this.searchControl.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query) this.movieService.searchMovies(query.trim(), 1);
    });
  }

}
