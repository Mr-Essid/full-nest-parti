import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Match } from 'src/match/entities/match.entity';

export type MatchPlayerDocument = HydratedDocument<MatchPlayer>;

@Schema({ timestamps: true })
export class MatchPlayer {
  @Prop({ ype: Boolean })
  isAccepted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Match', required: true })
  matchId: Match;
}

const MatchPlayerSchema = SchemaFactory.createForClass(MatchPlayer);

MatchPlayerSchema.index({ matchId: 1, userId: 1 }, { unique: true });

export { MatchPlayerSchema };
