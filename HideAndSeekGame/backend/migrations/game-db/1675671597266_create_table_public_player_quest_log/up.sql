CREATE TABLE "public"."player_quest_log" ("id" serial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "player_id" varchar NOT NULL, "quest_id" integer NOT NULL, "progress" integer NOT NULL DEFAULT 0, "has_completed" boolean NOT NULL DEFAULT false, PRIMARY KEY ("id") , UNIQUE ("id"));COMMENT ON TABLE "public"."player_quest_log" IS E'This table contains the daily logs / progress of daily duties of players';
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
CREATE TRIGGER "set_public_player_quest_log_updated_at"
BEFORE UPDATE ON "public"."player_quest_log"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_player_quest_log_updated_at" ON "public"."player_quest_log" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
