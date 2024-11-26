import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TerrainDocument = HydratedDocument<Terrain>;

@Schema({ timestamps: true })
export class Terrain {
  @Prop({ type: Date, required: true })
  date: Date = new Date();

  @Prop({ required: true })
  label: string;

  @Prop({})
  description: string;

  @Prop({ type: Number, required: true })
  width: number;

  @Prop({ type: Number, required: true })
  height: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ required: true })
  longitude: string;

  @Prop({ required: true })
  latitude: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  managerId: Types.ObjectId;


  @Prop({ type: [Types.ObjectId], ref: 'Match' })
  matchsIn: Types.ObjectId[]
}

export const TerrainSchema = SchemaFactory.createForClass(Terrain);
