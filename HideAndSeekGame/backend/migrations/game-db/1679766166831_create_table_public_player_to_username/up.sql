CREATE TABLE "public"."player_to_username" ("player_id" varchar NOT NULL, "username" varchar NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("player_id") );
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
CREATE TRIGGER "set_public_player_to_username_updated_at"
BEFORE UPDATE ON "public"."player_to_username"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_player_to_username_updated_at" ON "public"."player_to_username" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
