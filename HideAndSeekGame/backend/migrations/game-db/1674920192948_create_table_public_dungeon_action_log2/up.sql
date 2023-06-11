CREATE TABLE "public"."dungeon_action_log2" ("player_id" text NOT NULL, "dungeon_easy_completed_count" integer NOT NULL, "dungeon_hard_completed_count" integer NOT NULL, "dungeon_nightmare_completed_count" integer NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("player_id") );