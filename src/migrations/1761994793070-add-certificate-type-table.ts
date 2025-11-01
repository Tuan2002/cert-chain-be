import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCertificateTypeTable1761994793070 implements MigrationInterface {
    name = 'AddCertificateTypeTable1761994793070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "certificate_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "code" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "is_active" boolean NOT NULL DEFAULT false, "init_tx_hash" character varying, CONSTRAINT "UQ_06064a05121f48fb2f424ff7e20" UNIQUE ("code"), CONSTRAINT "PK_03f8d50f3c14d1b91f3ca1f78ce" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "certificate_types"`);
    }

}
