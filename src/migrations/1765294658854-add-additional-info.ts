import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdditionalInfo1765294658854 implements MigrationInterface {
    name = 'AddAdditionalInfo1765294658854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ADD "additional_info" text`);
        await queryRunner.query(`ALTER TABLE "organization_registrations" ADD "additional_info" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization_registrations" DROP COLUMN "additional_info"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "additional_info"`);
    }

}
