CREATE TABLE "public"."quests" ("id" serial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "target_item" text NOT NULL, "target_quantity" integer NOT NULL, "description" text NOT NULL, "rewards" jsonb NOT NULL, "is_active" boolean NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));COMMENT ON TABLE "public"."quests" IS E'This table contains the quests/daily duties details';
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_quests_updated_at"
BEFORE UPDATE ON "public"."quests"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_quests_updated_at" ON "public"."quests" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
