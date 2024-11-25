import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Role } from 'src/decorators/role/role.decorator';
import { UserRole } from 'src/users/enums/users.enums';
import { RolesGuard } from 'src/guards/roles-guard/roles-guard.guard';
import {
  CreateMovieDocs,
  FindAllMoviesDocs,
  FindOneMovieDocs,
  UpdateMovieDocs,
  DeleteMovieDocs,
  SyncMoviesDocs,
} from './docs/movies.docs';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('movies')
@UseGuards(AuthGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Role(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @CreateMovieDocs()
  async create(@Body() createMovieDto: CreateMovieDto) {
    try {
      return await this.moviesService.create(createMovieDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post('sincronize')
  @SyncMoviesDocs()
  @Role(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async syncMovies() {
    try {
      return await this.moviesService.syncMovies();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @FindAllMoviesDocs()
  findAll() {
    try {
      return this.moviesService.findAll();
    } catch (error) {
      return { message: error.message };
    }
  }

  @Get(':id')
  @Role(UserRole.REGULAR)
  @UseGuards(RolesGuard)
  @FindOneMovieDocs()
  async findOne(@Param('id') id: string) {
    try {
      return await this.moviesService.findOne(id);
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid movie ID format');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @Role(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UpdateMovieDocs()
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    try {
      return await this.moviesService.update(id, updateMovieDto);
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid movie ID format');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @DeleteMovieDocs()
  async remove(@Param('id') id: string) {
    try {
      return await this.moviesService.remove(id);
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid movie ID format');
      }
      throw new BadRequestException(error.message);
    }
  }
}
