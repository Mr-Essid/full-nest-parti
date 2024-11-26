import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MatchDocument = HydratedDocument<Match>;

@Schema({ timestamps: true })
export class Match {
  @Prop({ type: Date, required: true })
  date: Date = new Date();

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Terrain', required: true })
  terrainId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'MatchPlayer', required: true })
  playersOfMatch: Types.ObjectId[]

}

export const MatchSchema = SchemaFactory.createForClass(Match);
