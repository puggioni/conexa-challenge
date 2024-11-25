import { HydratedDocument } from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../enums/users.enums';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    default: UserRole.REGULAR,
    enum: [UserRole.ADMIN, UserRole.REGULAR],
  })
  role: string;

  @Prop({ default: false })
  isTest?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
