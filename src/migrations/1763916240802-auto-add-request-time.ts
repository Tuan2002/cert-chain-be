import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoAddRequestTime1763916240802 implements MigrationInterface {
    name = 'AutoAddRequestTime1763916240802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificate_requests" DROP COLUMN "requested_time"`);
        await queryRunner.query(`ALTER TABLE "certificate_requests" ADD "requested_time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificate_requests" DROP COLUMN "requested_time"`);
        await queryRunner.query(`ALTER TABLE "certificate_requests" ADD "requested_time" TIMESTAMP NOT NULL`);
    }

}
