CREATE TABLE "public"."inventory_action_log" ("player_id" uuid NOT NULL, "item_id" varchar NOT NULL, "action_type" varchar NOT NULL, "count" integer NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("player_id","item_id","created_at") );