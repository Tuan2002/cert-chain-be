import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRelationCertificate1764390268678 implements MigrationInterface {
    name = 'ChangeRelationCertificate1764390268678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "FK_9d12b2aa84f68bd5478a4da7a61"`);
        await queryRunner.query(`ALTER TABLE "certificates" DROP COLUMN "certificate_requests_id"`);
        await queryRunner.query(`ALTER TABLE "certificate_requests" DROP COLUMN "certificate_id"`);
        await queryRunner.query(`ALTER TABLE "certificate_requests" ADD "certificate_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "certificate_requests" ADD CONSTRAINT "FK_532c92ba01e30779c5a2a767870" FOREIGN KEY ("certificate_id") REFERENCES "certificates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificate_requests" DROP CONSTRAINT "FK_532c92ba01e30779c5a2a767870"`);
        await queryRunner.query(`ALTER TABLE "certificate_requests" DROP COLUMN "certificate_id"`);
        await queryRunner.query(`ALTER TABLE "certificate_requests" ADD "certificate_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "certificates" ADD "certificate_requests_id" uuid`);
        await queryRunner.query(`ALTER TABLE "certificates" ADD CONSTRAINT "FK_9d12b2aa84f68bd5478a4da7a61" FOREIGN KEY ("certificate_requests_id") REFERENCES "certificate_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
