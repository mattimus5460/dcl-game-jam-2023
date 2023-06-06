BEGIN TRANSACTION;
ALTER TABLE "public"."dungeon_action_log2" DROP CONSTRAINT "dungeon_action_log2_pkey";

ALTER TABLE "public"."dungeon_action_log2"
    ADD CONSTRAINT "dungeon_action_log2_pkey" PRIMARY KEY ("created_at");
COMMIT TRANSACTION;
