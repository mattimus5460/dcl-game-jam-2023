CREATE TABLE "public"."equipable_items" ("player_id" text NOT NULL, "item_id" varchar NOT NULL, "item_type" varchar NOT NULL, "equipped" boolean NOT NULL DEFAULT false, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("player_id","item_id","item_type") );
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
CREATE TRIGGER "set_public_equipable_items_updated_at"
BEFORE UPDATE ON "public"."equipable_items"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_equipable_items_updated_at" ON "public"."equipable_items" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
