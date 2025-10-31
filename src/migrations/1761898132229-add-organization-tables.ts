import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrganizationTables1761898132229 implements MigrationInterface {
    name = 'AddOrganizationTables1761898132229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization_registrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "wallet_address" character varying NOT NULL, "owner_first_name" character varying NOT NULL, "owner_last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "organization_name" character varying NOT NULL, "organization_description" character varying, "website" character varying, "country_code" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "reject_reason" character varying, CONSTRAINT "PK_a084224245d37f29c177ef29790" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file_uploads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "original_name" character varying NOT NULL, "bucket_name" character varying NOT NULL, "file_key" character varying NOT NULL, "mime_type" character varying NOT NULL, "size" integer NOT NULL, "storage_folder" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'uploaded', "uploader_id" uuid NOT NULL, CONSTRAINT "UQ_84dd2873be77bb08dbb90c20593" UNIQUE ("file_key"), CONSTRAINT "PK_b3ebfc99a8b660f0bc64a052b42" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_name" character varying NOT NULL, "email" character varying, "hashed_password" character varying NOT NULL, "is_locked" boolean NOT NULL DEFAULT false, "is_first_login" boolean NOT NULL DEFAULT true, "login_failed_times" integer NOT NULL DEFAULT '0', "role" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "wallet_address" character varying, "address" character varying, "phone" character varying, "dob" TIMESTAMP, "gender" integer, "avatar" character varying, CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "wallet_address" character varying NOT NULL, "is_owner" boolean NOT NULL, "organization_id" uuid NOT NULL, "user_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "added_tx_hash" character varying, CONSTRAINT "PK_c2b39d5d072886a4d9c8105eb9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "description" character varying, "country_code" character varying NOT NULL, "website" character varying, "is_active" boolean NOT NULL DEFAULT false, "init_tx_hash" character varying, "change_owner_tx_hash" character varying, CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "file_uploads" ADD CONSTRAINT "FK_37115e66d6370b5a51cfbdd9144" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_members" ADD CONSTRAINT "FK_7062a4fbd9bab22ffd918e5d3d9" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_members" ADD CONSTRAINT "FK_89bde91f78d36ca41e9515d91c6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization_members" DROP CONSTRAINT "FK_89bde91f78d36ca41e9515d91c6"`);
        await queryRunner.query(`ALTER TABLE "organization_members" DROP CONSTRAINT "FK_7062a4fbd9bab22ffd918e5d3d9"`);
        await queryRunner.query(`ALTER TABLE "file_uploads" DROP CONSTRAINT "FK_37115e66d6370b5a51cfbdd9144"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
        await queryRunner.query(`DROP TABLE "organization_members"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "file_uploads"`);
        await queryRunner.query(`DROP TABLE "organization_registrations"`);
    }

}
