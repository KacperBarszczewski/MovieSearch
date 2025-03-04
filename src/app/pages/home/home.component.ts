import { Component } from '@angular/core';
import { MovieSearchComponent } from "../../components/movie-search/movie-search.component";
import { MovieTableComponent } from "../../components/movie-table/movie-table.component";

@Component({
  selector: 'page-home',
  imports: [MovieSearchComponent, MovieTableComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {

}
