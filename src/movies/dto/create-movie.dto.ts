import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsNumber()
  episode_id: number;

  @IsString()
  @IsOptional()
  opening_crawl?: string;

  @IsString()
  director: string;

  @IsString()
  producer: string;

  @IsDateString()
  release_date: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  species?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  starships?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  vehicles?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  characters?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  planets?: string[];
}
