import { Module } from '@nestjs/common';
import { CabinsService } from './cabins.service';
import { CabinsController } from './cabins.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { Cabin } from './entities/cabin.entity';
import { S3Module } from 'src/common/s3/s3.module';

@Module({
  imports: [DatabaseModule.forFeature([Cabin]), S3Module],
  controllers: [CabinsController],
  providers: [CabinsService],
})
export class CabinsModule {}
