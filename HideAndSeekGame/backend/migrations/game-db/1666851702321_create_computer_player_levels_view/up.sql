CREATE
OR REPLACE VIEW "public"."computed_player_levels" AS
SELECT
  xp_action_log.player_id,
  xp_action_log.level_type,
  sum(xp_gained) AS xp,
  MAX(level) as level
FROM
  xp_action_log
GROUP BY
  xp_action_log.player_id,
  xp_action_log.level_type;
