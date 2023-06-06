CREATE TABLE "public"."pets_inventory" ("player_id" varchar NOT NULL, "pet_type" varchar NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "owned" boolean NOT NULL, "date_sold" timestamptz, PRIMARY KEY ("player_id","pet_type") );COMMENT ON TABLE "public"."pets_inventory" IS E'table to hold pet information';
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
CREATE TRIGGER "set_public_pets_inventory_updated_at"
BEFORE UPDATE ON "public"."pets_inventory"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_pets_inventory_updated_at" ON "public"."pets_inventory" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
