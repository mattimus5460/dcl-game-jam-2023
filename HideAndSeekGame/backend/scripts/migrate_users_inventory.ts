import * as process from "process";
import * as console from "console";
import fs from 'fs';

import {parse} from 'csv-parse';
import axios from "axios";

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const FILE_NAME = process.env.FILE_NAME;

const MUTATION = `
mutation InsertInventoryItems($objects: [inventory_action_log_insert_input!]!) {
  insert_inventory_action_log(objects: $objects) {
    affected_rows
  }
}
`

const WriteToServer = async (inserts: any[]) => {
    const res = await axios.post(`http://ac5e6401de94d4609899ffec3dd2524d-2064127561.us-east-1.elb.amazonaws.com/v1/graphql`, {
        variables: {
            objects: inserts
        },
        query: MUTATION
    }, {
        headers: {
            'X-Hasura-Admin-Secret': ADMIN_SECRET,
            'x-hasura-role': 'admin'
        }

    })
    console.log(res.data)
}

type Record = { [key: string]: string };

const KEYS_TO_EXCLUDE = [
    'consecutiveLoginDays',
    'fmBody',
    'fmHead',
    'helmet',
    'id',
    'lastLogin',
    'username',
    'questTime',
    'pumpkins',
    'candles',
    'pet',
    'pet2',
    'pet3',
    'boss',
    'boss2',
    'sword',
    'shield'
]

export enum ITEM_TYPES {
    BERRY = 'berry',
    BONE = 'bone',
    CHICKEN = 'chicken',
    CRYSTAL = 'crystal',
    COIN = 'coin',
    STEEL = 'steel',
    PLANK = 'plank',
    EGG = 'egg',
    BOAT = 'boat',
    ICEHEART = 'ice-heart',
    ICESHARD = 'ice-shard',
    ROCK = 'rock',
    TREE = 'tree',
    POTION = 'potion',
    XPPOTION = 'xp-potion',
    GEM1 = 'gem1',
    GEM2 = 'gem2',
    GEM3 = 'gem3',
    GEM4 = 'gem4',
    HOME = 'home',
    DRAGON = 'dragon',
}


const NAME_CONVERSION: Record = {
    'frostSkull': ITEM_TYPES.ICESHARD,
    'iceShard': ITEM_TYPES.ICEHEART,
    'pet4': ITEM_TYPES.COIN,
    'enemy': ITEM_TYPES.BONE
}
// @ts-ignore
const parser = parse({columns: true}, async (err, records) => {
    const filterd = records.map((record: { [key: string]: string }) => {
        return Object.keys(record).reduce((acc, key) => {
            if ((!key.toLowerCase().includes('level') && !key.toLowerCase().includes('xp') && !key.includes('hsu') && !key.includes('polisher') && !KEYS_TO_EXCLUDE.includes(key)) || key === 'uuid') {
                acc[NAME_CONVERSION[key] || key] = record[key];
            }
            return acc;
        }, {} as { [key: string]: string })
    })

    const toFlatten = filterd.map((row: Record) => {
        const InventoryKeys = Object.keys(row).filter((key) => !key.toLowerCase().includes('uuid'))

        return InventoryKeys.map((type) => {
            return {
                player_id: row.uuid,
                item_id: type,
                action_type: 'INCREASE_ITEM',
                count: parseInt(row?.[type]) || 0,
            }
        });
    });

    const toWrite = toFlatten.reduce((acc: Record[], rows: Record[]) => [...acc, ...rows], []);
    console.log(toWrite);
    let JobArray = [];
    let counter = 0;
    let tempHolder = [];

    for (let item of toWrite) {
        if (counter === 500) {
            JobArray.push(tempHolder);
            tempHolder = [];
            counter = 0;
        }
        tempHolder.push(item)
        counter++
    }
    if (counter > 0) {
        JobArray.push(tempHolder)
    }

    // console.log(JobArray);
    let pageCounter = 0;
    for (let batch of JobArray) {
        await WriteToServer(batch)
        console.log('finished page:',pageCounter + 1,'from a total of',JobArray.length)
        pageCounter++;

    }
});

fs.createReadStream(FILE_NAME).pipe(parser);
console.log(ADMIN_SECRET)
