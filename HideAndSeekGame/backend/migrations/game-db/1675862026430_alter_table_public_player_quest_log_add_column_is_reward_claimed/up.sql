alter table "public"."player_quest_log" add column "is_reward_claimed" boolean
 not null default 'false';
