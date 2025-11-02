import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUpdateTxhashToCertificateType1762078014884 implements MigrationInterface {
    name = 'AddUpdateTxhashToCertificateType1762078014884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificate_types" ADD "last_changed_tx_hash" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificate_types" DROP COLUMN "last_changed_tx_hash"`);
    }

}
