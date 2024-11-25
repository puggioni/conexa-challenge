import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './schema/movie.schema';
import axios from 'axios';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async create(createMovieDto: CreateMovieDto) {
    const existingMovie = await this.movieModel.findOne({
      episode_id: createMovieDto.episode_id,
    });

    if (existingMovie) {
      throw new BadRequestException(
        `Movie with episode_id ${createMovieDto.episode_id} already exists`,
      );
    }

    const createdMovie = await this.movieModel.create(createMovieDto);
    return createdMovie;
  }

  findAll() {
    return this.movieModel.find();
  }

  findOne(id: string) {
    const movie = this.movieModel.findById(id);

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const updatedMovie = await this.movieModel.findByIdAndUpdate(
      id,
      { $set: updateMovieDto },
      { new: true },
    );

    if (!updatedMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return updatedMovie;
  }

  async remove(id: string) {
    const deletedMovie = await this.movieModel.findByIdAndDelete(id);

    if (!deletedMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return { message: `${deletedMovie.title} deleted successfully` };
  }

  async syncMovies() {
    try {
      const response = await axios.get('https://swapi.dev/api/films/');
      const swapiMovies = response.data.results;

      const existingMovies = await this.movieModel.find({}, { episode_id: 1 });
      const existingEpisodeIds = new Set(
        existingMovies.map((m) => m.episode_id),
      );

      const newMovies = swapiMovies.filter(
        (movie) => !existingEpisodeIds.has(movie.episode_id),
      );

      if (newMovies.length === 0) {
        return { message: 'No new movies to sync' };
      }

      const processedMovies = await Promise.all(
        newMovies.map(async (movie: Movie) => {
          const [characters, planets, starships, vehicles, species] =
            await Promise.all([
              this.fetchNames(movie.characters),
              this.fetchNames(movie.planets),
              this.fetchNames(movie.starships),
              this.fetchNames(movie.vehicles),
              this.fetchNames(movie.species),
            ]);

          return {
            title: movie.title,
            episode_id: movie.episode_id,
            opening_crawl: movie.opening_crawl,
            director: movie.director,
            producer: movie.producer,
            release_date: new Date(movie.release_date),
            characters,
            planets,
            starships,
            vehicles,
            species,
          };
        }),
      );

      await this.movieModel.insertMany(processedMovies);

      return {
        message: `Successfully synced ${processedMovies.length} new movies`,
        syncedMovies: processedMovies.map((m) => m.title),
      };
    } catch (error) {
      this.logger.error(`Error syncing movies: ${error.message}`);
      throw error;
    }
  }

  private async fetchNames(urls: string[]): Promise<string[]> {
    if (!urls?.length) return [];

    try {
      const responses = await Promise.all(
        urls.map((url) =>
          axios
            .get(url)
            .then((response) => response.data.name)
            .catch((error) => {
              this.logger.warn(`Failed to fetch ${url}: ${error.message}`);
              return null;
            }),
        ),
      );

      return responses.filter((name) => name !== null);
    } catch (error) {
      this.logger.error(`Error fetching names: ${error.message}`);
      return [];
    }
  }
}
