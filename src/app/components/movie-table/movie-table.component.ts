import { CommonModule } from "@angular/common";
import { Component, AfterViewInit, ViewChild, Input } from "@angular/core";
import { Movie } from "../../models/movie";
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MovieService } from "../../services/movie.service";
import { Observable } from "rxjs/internal/Observable";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";

const sampleMovies: Movie[] = [
  {
    Poster: "https://example.com/poster1.jpg",
    Title: "Inception",
    Year: "2010",
    Runtime: "148 min",
    Genre: "Action, Adventure, Sci-Fi",
    Director: "Christopher Nolan",
    Plot: "A thief who enters the dreams of others to steal secrets from their subconscious."
  },
  {
    Poster: "https://example.com/poster2.jpg",
    Title: "The Shawshank Redemption",
    Year: "1994",
    Runtime: "142 min",
    Genre: "Drama",
    Director: "Frank Darabont",
    Plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
  },
  {
    Poster: "https://example.com/poster3.jpg",
    Title: "Pulp Fiction",
    Year: "1994",
    Runtime: "154 min",
    Genre: "Crime, Drama",
    Director: "Quentin Tarantino",
    Plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption."
  }
];

@Component({
  selector: 'app-movie-table',
  imports: [MatTableModule, MatSortModule, CommonModule, DragDropModule,MatPaginatorModule],
  templateUrl: './movie-table.component.html'
})
export class MovieTableComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  numberMoves$: Observable<number> = new Observable<number>();
  movies$: Observable<Movie[]> = new Observable<Movie[]>();

  displayedColumns: (keyof Movie)[] = ['Poster', 'Title', 'Year', 'Runtime', 'Genre', 'Director', 'Plot'];
  dataSource = new MatTableDataSource<Movie>([]);
  numberMoves: number = 0;

  constructor(private readonly movieService: MovieService) {
    this.movies$ = this.movieService.movies$;
    this.numberMoves$ = this.movieService.numberMoves$;
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.movies$.subscribe(movies => {
      this.dataSource.data = movies;
    });

    this.numberMoves$.subscribe(numberMoves => {
      this.numberMoves = numberMoves;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  pageChanged(event: {pageIndex:number}): void {
    console.log('Page event', event); 
  }

}
