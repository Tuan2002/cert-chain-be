import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCerificateRequest1764518729964 implements MigrationInterface {
    name = 'RemoveCerificateRequest1764518729964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificate_types" ADD "additional_info" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificate_types" DROP COLUMN "additional_info"`);
    }

}
