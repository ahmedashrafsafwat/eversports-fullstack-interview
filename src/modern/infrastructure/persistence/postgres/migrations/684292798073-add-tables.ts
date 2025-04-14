import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTables1684292798073 implements MigrationInterface {
    name = 'AddTables1684292798073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "email_index" ON "User" ("email") `);
        await queryRunner.query(`CREATE TYPE "Membership_state_enum" AS ENUM ('expired','pendin','active') `)
        await queryRunner.query(`CREATE TABLE "Membership" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "director" character varying NOT NULL, "release_date" date NOT NULL, "genre" "Membership_genre_enum" NOT NULL DEFAULT 'Other', "user_id" uuid NOT NULL, CONSTRAINT "UQ_db9b75bd0e21fb0e5e018f03412" UNIQUE ("name"), CONSTRAINT "PK_56d58b76292b87125c5ec8bdde0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "name_index" ON "Membership" ("name") `);
        await queryRunner.query(`CREATE INDEX "director_index" ON "Membership" ("director") `);
        await queryRunner.query(`ALTER TABLE "Membership" ADD CONSTRAINT "FK_6ed635b3fc27fa580be6872153a" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Membership" DROP CONSTRAINT "FK_6ed635b3fc27fa580be6872153a"`);
        await queryRunner.query(`DROP INDEX "public"."name_index"`);
        await queryRunner.query(`DROP TABLE "Membership"`);
        await queryRunner.query(`DROP INDEX "public"."email_index"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }

}