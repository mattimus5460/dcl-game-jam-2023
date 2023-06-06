import fs from 'fs';

import {parse} from 'csv-parse';
import axios from "axios";

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const FILE_NAME = process.env.FILE_NAME;

const MUTATION = `
mutation MyMutation($objects: [pets_inventory_insert_input!]!) {
  insert_pets_inventory(objects: $objects, on_conflict: {constraint: pets_inventory_pkey, update_columns: owned}) {
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

// type Record = { [key: string]: string | number };

const KEYS_TO_INCLUDE = [
    'pet',
    'pet2',
    'pet3',
    'uuid'
]

const PETMAPPING: Record<string, string> = {
    'pet': 'owl',
    'pet2': 'dragon',
    'pet3': 'phoenix',
}

// @ts-ignore
const parser = parse({columns: true}, async (err, records) => {
    const filterd = records.map((record: { [key: string]: string }) => {
        return Object.keys(record).reduce((acc, key) => {
            if (KEYS_TO_INCLUDE.includes(key)) {
                if (key === 'uuid') {
                    acc[key] = record[key];

                } else {
                    acc[PETMAPPING[key]] = parseInt(record[key]);

                }
            }
            return acc;
        }, {} as { [key: string]: number | string })
    }).filter((i: { [key: string]: number }) => Boolean(Object.keys(i).find((key) => i[key] && key !== 'uuid'))).map((i: any) => {
        const pets = Object.keys(i).reduce((acc, key) => {
            if (key !== 'uuid' && i[key]) {
                acc.push(key);
            }
            return acc;
        }, [] as string[]);

        return { uuid: i.uuid, pets }
    }).reduce((accm: Record<string, any>[], item: any) => {
        for (let pet of item.pets) {
            accm.push({
                player_id: item.uuid,
                pet_type: pet,
                owned: true
            })
        }
        return accm;
    }, [] as Record<string, any>[])
        console.log(JSON.stringify(filterd, null, 2))
        await WriteToServer(filterd)


    // const toWrite = toFlatten.reduce((acc: Record[], rows: Record[]) => [...acc, ...rows], []);
    // console.log(toWrite);
    // let JobArray = [];
    // let counter = 0;
    // let tempHolder = [];
    //
    // for (let item of toWrite) {
    //     if (counter === 500) {
    //         JobArray.push(tempHolder);
    //         tempHolder = [];
    //         counter = 0;
    //     }
    //     tempHolder.push(item)
    //     counter++
    // }
    // if (counter > 0) {
    //     JobArray.push(tempHolder)
    // }

    // // console.log(JobArray);
    // let pageCounter = 0;
    // for (let batch of JobArray) {
    //     await WriteToServer(batch)
    //     console.log('finished page:',pageCounter + 1,'from a total of',JobArray.length)
    //     pageCounter++;
    //
    // }
});

if (FILE_NAME) {
    fs.createReadStream(FILE_NAME).pipe(parser);
    console.log(ADMIN_SECRET)
}

