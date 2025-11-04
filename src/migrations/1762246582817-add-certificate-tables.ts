import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCertificateTables1762246582817 implements MigrationInterface {
    name = 'AddCertificateTables1762246582817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "certificate_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "request_type" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "requested_time" TIMESTAMP NOT NULL, "rejection_reason" character varying, "organization_id" uuid NOT NULL, "certificate_id" character varying NOT NULL, CONSTRAINT "PK_69c63a8245ee8787a471cce003f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "certificates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "code" character varying NOT NULL, "certificate_hash" character varying, "status" character varying NOT NULL DEFAULT 'created', "valid_from" TIMESTAMP NOT NULL, "valid_to" TIMESTAMP NOT NULL, "certificate_type_id" uuid NOT NULL, "organization_id" uuid NOT NULL, "certificate_profile_id" uuid NOT NULL, "issuer_id" uuid NOT NULL, "approved_at" TIMESTAMP, "revoked_at" TIMESTAMP, "signed_tx_hash" character varying, "approved_tx_hash" character varying, "revoked_tx_hash" character varying, "certificate_requests_id" uuid, CONSTRAINT "UQ_e9e6937f74d9a653f0fc3299132" UNIQUE ("code"), CONSTRAINT "REL_7ed1457cb75be6df5937cf3aa4" UNIQUE ("certificate_profile_id"), CONSTRAINT "PK_e4c7e31e2144300bea7d89eb165" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "certificate_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "author_name" character varying NOT NULL, "author_id_card" character varying NOT NULL, "author_dob" TIMESTAMP NOT NULL, "author_email" character varying NOT NULL, "author_image" character varying, "author_documents" json, "author_country_code" character varying NOT NULL, "grant_level" integer NOT NULL, CONSTRAINT "PK_171f0f058bc223a8b43c3a212f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "certificate_requests" ADD CONSTRAINT "FK_e5bac1712fd87ded61abfecd352" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "certificates" ADD CONSTRAINT "FK_bdfe3bffc137ae7204afe8ace86" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "certificates" ADD CONSTRAINT "FK_76c141ed3f4a7a428a1a691a224" FOREIGN KEY ("certificate_type_id") REFERENCES "certificate_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "certificates" ADD CONSTRAINT "FK_9d12b2aa84f68bd5478a4da7a61" FOREIGN KEY ("certificate_requests_id") REFERENCES "certificate_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "certificates" ADD CONSTRAINT "FK_ac7d9800db383913cfb99d268ce" FOREIGN KEY ("issuer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "certificates" ADD CONSTRAINT "FK_7ed1457cb75be6df5937cf3aa48" FOREIGN KEY ("certificate_profile_id") REFERENCES "certificate_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "file_uploads"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "FK_7ed1457cb75be6df5937cf3aa48"`);
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "FK_ac7d9800db383913cfb99d268ce"`);
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "FK_9d12b2aa84f68bd5478a4da7a61"`);
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "FK_76c141ed3f4a7a428a1a691a224"`);
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "FK_bdfe3bffc137ae7204afe8ace86"`);
        await queryRunner.query(`ALTER TABLE "certificate_requests" DROP CONSTRAINT "FK_e5bac1712fd87ded61abfecd352"`);
        await queryRunner.query(`DROP TABLE "certificate_profiles"`);
        await queryRunner.query(`DROP TABLE "certificates"`);
        await queryRunner.query(`DROP TABLE "certificate_requests"`);
        await queryRunner.query(`CREATE TABLE "file_uploads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "original_name" character varying NOT NULL, "bucket_name" character varying NOT NULL, "file_key" character varying NOT NULL, "mime_type" character varying NOT NULL, "size" integer NOT NULL, "storage_folder" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'uploaded', "uploader_id" uuid NOT NULL, CONSTRAINT "UQ_84dd2873be77bb08dbb90c20593" UNIQUE ("file_key"), CONSTRAINT "PK_b3ebfc99a8b660f0bc64a052b42" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "file_uploads" ADD CONSTRAINT "FK_37115e66d6370b5a51cfbdd9144" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
