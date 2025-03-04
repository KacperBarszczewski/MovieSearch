import { Movie } from "./movie";

export interface MovieSearchResponse {
    Search: { imdbID: string }[];
    totalResults: string;
    Response: string;
}