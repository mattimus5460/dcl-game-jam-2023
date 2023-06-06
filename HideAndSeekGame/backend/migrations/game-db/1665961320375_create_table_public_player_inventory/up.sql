CREATE TABLE "public"."player_inventory" ("id" uuid NOT NULL, "item_id" varchar NOT NULL, "count" integer NOT NULL DEFAULT 0, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id","item_id") , UNIQUE ("id", "item_id"));
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
CREATE TRIGGER "set_public_player_inventory_updated_at"
BEFORE UPDATE ON "public"."player_inventory"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_player_inventory_updated_at" ON "public"."player_inventory" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
