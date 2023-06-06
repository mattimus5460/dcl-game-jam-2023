alter table "public"."dungeon_action_log" drop constraint "dungeon_action_log_pkey";
alter table "public"."dungeon_action_log"
    add constraint "dungeon_action_log_pkey"
    primary key ("player_id");
