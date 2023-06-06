alter table "public"."dungeon_action_log2" drop constraint "dungeon_action_log2_pkey";
alter table "public"."dungeon_action_log2"
    add constraint "dungeon_action_log2_pkey"
    primary key ("player_id");
