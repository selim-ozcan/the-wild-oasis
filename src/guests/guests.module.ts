import { Module } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { Guest } from './entities/guest.entity';

@Module({
  imports: [DatabaseModule.forFeature([Guest])],
  controllers: [GuestsController],
  providers: [GuestsService],
})
export class GuestsModule {}
