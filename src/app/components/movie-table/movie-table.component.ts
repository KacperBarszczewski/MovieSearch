import { CommonModule } from "@angular/common";
import { Component, AfterViewInit, inject, ViewChild } from "@angular/core";
import { Movie } from "../../models/movie";
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';

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
  imports: [MatTableModule, MatSortModule, CommonModule,DragDropModule],
  templateUrl: './movie-table.component.html'
})
export class MovieTableComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  
  displayedColumns: (keyof Movie)[] = ['Poster', 'Title', 'Year', 'Runtime', 'Genre', 'Director', 'Plot'];
  dataSource = new MatTableDataSource(sampleMovies);
  sampleMovies = sampleMovies;

  drop(event: CdkDragDrop<string[]>) {
    // const prevActive = this.tabs[this.selectedTabIndex];
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    // this.selectedTabIndex = this.tabs.indexOf(prevActive);
  }



  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
