import * as process from "process";
import * as console from "console";
import fs from 'fs';

import {parse} from 'csv-parse';
import axios from "axios";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

const MUTATION = `
mutation InsertPlayerLevels($objects: [xp_action_log_insert_input!] = {}) {
  insert_xp_action_log(objects: $objects) {
    affected_rows
  }
}
`

const WriteToServer = async (inserts: any[]) => {
    const res = await axios.post(`http://ac5e6401de94d4609899ffec3dd2524d-2064127561.us-east-1.elb.amazonaws.com/v1/graphql`, {
        variables:  {
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

type Record = { [key: string]:string};
// @ts-ignore
const parser = parse({columns: true},  async (err, records) => {
    const filterd = records.map((record: { [key: string]:string}) => {
        return Object.keys(record).reduce((acc, key) => {
            if (key.toLowerCase().includes('level') || key.toLowerCase().includes('xp') || key === 'uuid') {
                acc[key] = record[key];
            }
            return acc;
        }, {} as { [key: string]: string })
    })

    const toFlatten = filterd.map((row: Record) => {
        const xpKeys = Object.keys(row).filter((key) => key.toLowerCase().includes('xp')).map(key => [key, key.replace('Xp', '')])
        const levelKeys = Object.keys(row).filter((key) => key.toLowerCase().includes('level')).map(key => [key, key.replace('Level', '')])
        const types = levelKeys.map(i => i[1])

        return types.map((type) => {
            return {
                player_id: row.uuid,
                level: row?.[levelKeys.find(i => i[1] === type)?.[0] || ''] || 0,
                level_type: type,
                xp_gained: row?.[xpKeys.find(i => i[1] === type)?.[0] || ''] || 0,
                total_xp: row?.[xpKeys.find(i => i[1] === type)?.[0] || ''] || 0,
            }
        });
    });

    const list = toFlatten.reduce((acc: any[], item: any) => [...acc, ...item], []);

    let JobArray = [];
    let counter = 0;
    let tempHolder = [];
    // console.log(list);

    for (let item of list) {
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
        // await WriteToServer(batch)
        // console.log('finished page:',pageCounter,'from a total of',JobArray.length)
        // pageCounter++;

    }
});

fs.createReadStream('results_40.csv').pipe(parser);
console.log(ADMIN_SECRET)
