ALTER TABLE equipable_items ALTER COLUMN item_id  TYPE integer USING (item_id::integer);
