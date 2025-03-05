import { Component } from '@angular/core';
import { MovieSearchComponent } from "../../components/movie-search/movie-search.component";
import { MovieTableComponent } from "../../components/movie-table/movie-table.component";
import { Observable } from 'rxjs';
import { MovieState } from '../../models/movieState';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'page-home',
  imports: [MovieSearchComponent, MovieTableComponent, CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  movieState$: Observable<MovieState>;

  constructor(private readonly movieService: MovieService) {
    this.movieState$ = this.movieService.movieState$;
  }

}
