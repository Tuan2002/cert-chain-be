import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRevokeResson1763973934273 implements MigrationInterface {
    name = 'AddRevokeResson1763973934273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificate_requests" ADD "revoke_reason" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificate_requests" DROP COLUMN "revoke_reason"`);
    }

}
