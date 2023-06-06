CREATE TABLE "public"."player_action_log" ("player_id" text NOT NULL, "action_name" varchar NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("player_id") );
