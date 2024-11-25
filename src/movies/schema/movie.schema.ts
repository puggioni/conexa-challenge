import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({
  timestamps: true,
})
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  episode_id: number;

  @Prop()
  opening_crawl: string;

  @Prop({ required: true })
  director: string;

  @Prop({ required: true })
  producer: string;

  @Prop({ required: true })
  release_date: Date;

  @Prop()
  species: string[];

  @Prop()
  starships: string[];

  @Prop()
  vehicles: string[];

  @Prop()
  characters: string[];

  @Prop()
  planets: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
