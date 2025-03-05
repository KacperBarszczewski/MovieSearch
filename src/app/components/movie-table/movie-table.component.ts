import { CommonModule } from "@angular/common";
import { Component, AfterViewInit, ViewChild } from "@angular/core";
import { Movie } from "../../models/movie";
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MovieService } from "../../services/movie.service";
import { Observable } from "rxjs/internal/Observable";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MovieState } from "../../models/movieState";
import { Subject, take, takeUntil } from "rxjs";

@Component({
  selector: 'app-movie-table',
  imports: [MatTableModule, MatSortModule, CommonModule, DragDropModule, MatPaginatorModule],
  templateUrl: './movie-table.component.html'
})
export class MovieTableComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  movieState$: Observable<MovieState>;
  private destroy$ = new Subject<void>();

  displayedColumns: (keyof Movie)[] = ['Poster', 'Title', 'Year', 'Runtime', 'Genre', 'Director', 'Plot'];
  dataSource = new MatTableDataSource<Movie>([]);

  constructor(private readonly movieService: MovieService) {
    this.movieState$ = this.movieService.movieState$;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.movieState$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      this.dataSource.data = state.movies;
    });

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  pageChanged(event: { pageIndex: number }): void {
    this.movieState$.pipe(take(1)).subscribe(state => {
      this.movieService.searchMovies(state.query, event.pageIndex + 1);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
