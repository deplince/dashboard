import { MigrationInterface, QueryRunner } from "typeorm";
import { User, UserRole } from '../libs/entities/src';
import * as bcrypt from 'bcrypt';

export class SeedUsersMigration1765614937212 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.manager.getRepository(User);

    const saltRounds = 10;
    const commonPassword = 'StrongPassword!0@';
    const passwordHash = await bcrypt.hash(commonPassword, saltRounds);

    const usersToSeed = [
      {
        email: 'admin@dashboard.com',
        password_hash: passwordHash,
        first_name: 'Super',
        last_name: 'Admin',
        role: UserRole.ADMIN,
      },
      {
        email: 'lorem@dashboard.com',
        password_hash: passwordHash,
        first_name: 'Lorem',
        last_name: 'Lorem',
        role: UserRole.USER,
      },
      {
        email: 'ipsum@dashboard.com',
        password_hash: passwordHash,
        first_name: 'Ipsum',
        last_name: 'Ipsum',
        role: UserRole.USER,
      },
      {
        email: 'dolor@dashboard.com',
        password_hash: passwordHash,
        first_name: 'Dolor',
        last_name: 'Dolor',
        role: UserRole.USER,
      },
    ];

    for (const userData of usersToSeed) {
      const existingUser = await userRepository.findOneBy({
        email: userData.email,
      });

      if (!existingUser) {
        const newUser = userRepository.create({
          ...userData,
          created_at: new Date(),
          updated_at: new Date(),
        });
        await userRepository.save(newUser);
        console.log(`Seeded user: ${userData.email}`);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.manager.getRepository(User);

    const emailsToDelete = [
      'admin@dashboard.com',
      'lorem@dashboard.com',
      'ipsum@dashboard.com',
      'dolor@dashboard.com',
    ];

    await userRepository.delete(emailsToDelete);
  }

}
