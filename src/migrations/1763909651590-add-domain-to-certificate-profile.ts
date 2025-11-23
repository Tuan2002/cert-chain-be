import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDomainToCertificateProfile1763909651590 implements MigrationInterface {
    name = 'AddDomainToCertificateProfile1763909651590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificate_profiles" ADD "domain" character varying`);
        await queryRunner.query(`ALTER TABLE "certificate_profiles" ADD "additional_info" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificate_profiles" DROP COLUMN "additional_info"`);
        await queryRunner.query(`ALTER TABLE "certificate_profiles" DROP COLUMN "domain"`);
    }

}
