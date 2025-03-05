import { Movie } from "./movie";

export interface MovieState {
    loading: boolean;
    movies: Movie[];
    numberOfMovies: number;
    query: string;
    pageIndex: number;
  }