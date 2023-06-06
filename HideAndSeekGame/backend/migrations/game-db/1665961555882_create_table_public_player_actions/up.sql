CREATE TABLE "public"."player_actions" ("player_id" uuid NOT NULL, "action_id" varchar NOT NULL, "target_type" varchar NOT NULL, "exp" integer NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("player_id","action_id","created_at") );
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
CREATE TRIGGER "set_public_player_actions_updated_at"
BEFORE UPDATE ON "public"."player_actions"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_player_actions_updated_at" ON "public"."player_actions" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
