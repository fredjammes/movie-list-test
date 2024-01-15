import { Injectable } from '@nestjs/common';
import { Credits, Image, Movie } from './generated/movie';
import { MOVIES_ENDPOINT, TMDB_BEARER_TOKEN, MOVIE_DETAIL_ENDPOINT, MOVIE_CREDIT_ENDPOINT, MOVIE_IMAGES_ENDPOINT } from './movie.endpoints';



@Injectable()
export class MovieService {
  async getMovies(): Promise<Movie[]> {
    const movieResponse = await fetch(MOVIES_ENDPOINT, {
      headers: { Authorization: `Bearer ${TMDB_BEARER_TOKEN}` },
    });

    if (!movieResponse.ok) {
      throw new Error('Something went wrong on movies query');
    }
    const { results } = (await movieResponse.json()) as { results };
    return results as Movie[];
  }

  async getMovie(id: string): Promise<Movie> {
    console.debug(id);
    const movieDetailResponse = await fetch(`${MOVIE_DETAIL_ENDPOINT}${id}`, {
      headers: { Authorization: `Bearer ${TMDB_BEARER_TOKEN}` },
    });
    if (!movieDetailResponse.ok) {
      throw new Error('Something went wrong on movie by Id query');
    }
    const movie: Movie = (await movieDetailResponse.json()) as Movie;
    return movie;
  }

  async getMovieCredits(id: string): Promise<Credits> {
    const movieCreditUrl = MOVIE_CREDIT_ENDPOINT.replace('{movie_id}', id);
    const movieCreditsResponse = await fetch(movieCreditUrl, {
      headers: { Authorization: `Bearer ${TMDB_BEARER_TOKEN}` },
    });
    if (!movieCreditsResponse.ok) {
      throw new Error('Something went wrong on movie by Id query');
    }
    const movieCredits: Credits = await movieCreditsResponse.json();
    return movieCredits;
  }

  async getMovieImages(id: string): Promise<Image> {
    const movieImagesUrl = MOVIE_IMAGES_ENDPOINT.replace('{movie_id}', id);
    const movieImagesResponse = await fetch(movieImagesUrl, {
      headers: { Authorization: `Bearer ${TMDB_BEARER_TOKEN}` },
    });
    if (!movieImagesResponse.ok) {
      throw new Error('Something went wrong on movie by Id query');
    }
    const movieImages: Image = await movieImagesResponse.json();
    movieImages.backdrops = movieImages.backdrops.filter(
      (backdrop) => backdrop.iso_639_1 === null
    );
    return movieImages;
  }
}
