import { MigrationInterface, QueryRunner } from "typeorm";
import { User, Record } from '../libs/entities/src';

export class SeedRecordsMigration1765614943522 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
      const userRepository = queryRunner.manager.getRepository(User);
      const recordRepository = queryRunner.manager.getRepository(Record);

      const users = await userRepository.find({
          where: [
              { email: 'lorem@dashboard.com' },
              { email: 'ipsum@dashboard.com' },
              { email: 'dolor@dashboard.com' }
          ]
      });

      const userMap = new Map(users.map(u => [u.email, u]));

      const lorem = userMap.get('lorem@dashboard.com');
      const ipsum = userMap.get('ipsum@dashboard.com');
      const dolor = userMap.get('dolor@dashboard.co');

      const recordsToInsert: Partial<Record>[] = [];

      if (lorem) {
          recordsToInsert.push(
              {
                  title: 'Project Alpha Requirements',
                  content: 'Drafting the initial requirements for Project Alpha. Met with stakeholders.',
                  user: lorem,
              },
              {
                  title: 'Meeting Notes: Q1 Goals',
                  content: 'Discussion about Q1 targets. Focus on user acquisition.',
                  user: lorem,
              }
          );
      }

      if (ipsum) {
          recordsToInsert.push(
              {
                  title: 'Bug Report #402',
                  content: 'Found a critical issue in the login flow on mobile devices.',
                  user: ipsum,
                  created_at: new Date(),
              },
              {
                  title: 'Deployment Checklist',
                  content: '1. Build assets. 2. Run tests. 3. Deploy to staging.',
                  user: ipsum,
              },
              {
                  title: 'API Documentation Updates',
                  content: 'Updated the Swagger docs for the user endpoints.',
                  user: ipsum,
              }
          );
      }

      if (dolor) {
          recordsToInsert.push(
              {
                  title: 'Client Feedback',
                  content: 'Received positive feedback from the new dashboard design.',
                  user: dolor,
                  created_at: new Date(),
              }
          );
      }

      if (recordsToInsert.length > 0) {
          await recordRepository.save(recordsToInsert);
          console.log(`Seeded ${recordsToInsert.length} records.`);
      }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      const recordRepository = queryRunner.manager.getRepository(Record);
      const userRepository = queryRunner.manager.getRepository(User);

      const users = await userRepository.find({
        where: [
            { email: 'lorem@dashboard.com' },
            { email: 'ipsum@dashboard.com' },
            { email: 'dolor@dashboard.com' }
        ]
      });

      const userIds = users.map(u => u.id);

      if (userIds.length > 0) {
          await recordRepository
              .createQueryBuilder()
              .delete()
              .where("user_id IN (:...ids)", { ids: userIds })
              .execute();
      }
  }

}
