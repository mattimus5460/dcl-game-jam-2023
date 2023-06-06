CREATE TABLE "public"."inventory_item" ("id" varchar NOT NULL, "name" varchar NOT NULL, "description" varchar, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("name"), UNIQUE ("id"));
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
CREATE TRIGGER "set_public_inventory_item_updated_at"
BEFORE UPDATE ON "public"."inventory_item"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_inventory_item_updated_at" ON "public"."inventory_item" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
