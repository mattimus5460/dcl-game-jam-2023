alter table "public"."player_quest_log" add column "is_bonus_reward_claimed" boolean
 not null default 'false';
