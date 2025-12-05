import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Challenge } from './entities/challenge.entity';
import { Milestone } from './entities/milestone.entity';
import { Recommendation } from './entities/recommendation.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Challenge,
      Milestone,
      Recommendation,
      Comment
    ])
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController]
})
export class ProjectsModule {}
