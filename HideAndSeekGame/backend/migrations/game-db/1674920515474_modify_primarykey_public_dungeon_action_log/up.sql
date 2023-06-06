BEGIN TRANSACTION;
ALTER TABLE "public"."dungeon_action_log" DROP CONSTRAINT "dungeon_action_log_pkey";

ALTER TABLE "public"."dungeon_action_log"
    ADD CONSTRAINT "dungeon_action_log_pkey" PRIMARY KEY ("created_at");
COMMIT TRANSACTION;
