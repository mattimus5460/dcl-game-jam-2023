CREATE OR REPLACE VIEW computed_player_inventory 
    AS SELECT player_id, item_id, SUM((CASE WHEN action_type = 'REDUCE_ITEM_BY' then count * -1 else count END)) as count from INVENTORY_ACTION_LOG GROUP BY player_id, item_id;
