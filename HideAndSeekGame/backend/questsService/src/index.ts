import express, { Request, Response } from 'express'
import cors from 'cors'
import Rand from 'rand-seed'
import { middleWare as authMiddleware } from './security/index'
import fetch from 'node-fetch'
import { RequestInit as RequestInitNF } from 'node-fetch'

const DEV_MODE = true
const TOTAL_QUESTS_IN_ONE_DAY = 4
const app = express()
const GRAPHQL_URL = 'http://ac5e6401de94d4609899ffec3dd2524d-2064127561.us-east-1.elb.amazonaws.com/v1/graphql'

app.use(cors({ origin: true }))
app.use(express.json())

const HEADERS = [
  ['x-hasura-admin-secret', 'E8IT1*e8wR*&gAI0ZT'],
  ['Content-Type', 'application/json']
]

app.get('/get_today_quests/:playerId', async (req: Request, res: Response) => {
  // get list of all active quest ids
  const response = await getListOfAllActiveQuestIds()

  if (response == null || !('data' in response) || !('quests' in response.data))
    return res.status(404).send({ detail: 'Cannot find any quests' })

  const activeQuests = response.data.quests
  const todaysQuests = getRandomQuestsForToday(activeQuests)

  if (todaysQuests.length === 0) return res.status(500).send({ detail: 'Not enough quests in DB' })

  for await (const iterator of todaysQuests) {
    const quest = iterator
    const logEntryResponse = await findPlayerQuestLogForToday(req.params.playerId, quest.id)
    if (!('data' in logEntryResponse) || !('player_quest_log' in logEntryResponse.data)) {
      return res.status(500).send({ detail: 'something went wrong while fetching' })
    }

    let logEntry = logEntryResponse.data.player_quest_log
    if (logEntry.length === 0) {
      // create new entry
      quest.progress = 0
      quest.has_completed = false
      quest.is_reward_claimed = false
      quest.is_bonus_reward_claimed = false
      await createPlayerQuestLogEntry({
        playerId: req.params.playerId,
        questId: quest.id
      })
    } else {
      logEntry = logEntry[0]
      quest.progress = logEntry.progress
      quest.has_completed = logEntry.has_completed
      quest.is_reward_claimed = logEntry.is_reward_claimed
      quest.is_bonus_reward_claimed = logEntry.is_bonus_reward_claimed
    }
  }
  return res.status(200).send(todaysQuests)
})

app.get('/claim_reward_request/:playerId/:questId', async (req: Request, res: Response) => {
  const playerId = req.params.playerId
  const questId = parseInt(req.params.questId, 10)

  // checking if the claim request is valid
  const questTargetObject = await getQuestTargetAmount(questId)
  if (
    !('data' in questTargetObject) ||
    !('quests_by_pk' in questTargetObject.data) ||
    !('target_quantity' in questTargetObject.data.quests_by_pk)
  )
    return res.status(500).send({ detail: 'Something went wrong.' })
  const questTarget = questTargetObject.data.quests_by_pk.target_quantity

  const logEntryResponse = await findPlayerQuestLogForToday(playerId, questId)
  if (!('data' in logEntryResponse) || !('player_quest_log' in logEntryResponse.data)) {
    return res.status(500).send({ detail: 'something went wrong while fetching' })
  }

  let logEntry = logEntryResponse.data.player_quest_log
  if (logEntry.length === 0)
    return res.status(400).send({ detail: 'Invalid claim request. No quest log found for today' })

  logEntry = logEntry[0]
  if (logEntry.progress < questTarget || logEntry.has_completed !== true)
    return res.status(400).send({ detail: 'Cannot claim reward!' })

  const updateResult = await updatePlayerQuestLog(
    { is_reward_claimed: true },
    playerId,
    questId
  )
  if (updateResult == null || updateResult !== 1)
    return res.status(500).send({ detail: 'Something went wrong while updating the table' })
  return res.status(200).send({ detail: 'Valid claim request' })
})

app.get('/claim_bonus_reward_request/:playerId', async (req: Request, res: Response) => {
  const playerId = req.params.playerId

  // checking if the claim request is valid
  const logEntrtiesResponse = await findAllPlayerQuestLogsForToday(playerId)
  if (!('data' in logEntrtiesResponse) || !('player_quest_log' in logEntrtiesResponse.data)) {
    return res.status(500).send({ detail: 'something went wrong while fetching' })
  }

  const logEntries = logEntrtiesResponse.data.player_quest_log
  if (logEntries.length === 0) return res.status(500).send({ detail: 'Something went wrong. No logs found' })

  let totalQuestsCompleted = 0
  for (const logEntry of logEntries) {
    if (logEntry.has_completed) totalQuestsCompleted += 1
  }
  if (totalQuestsCompleted !== logEntries.length)
    return res.status(400).send({ detail: 'Cannot claim reward! Not all quests are completed' })

  const updateResult = await markBonusRewardClaimedInDB(playerId)
  if (updateResult == null || updateResult !== TOTAL_QUESTS_IN_ONE_DAY)
    return res.status(500).send({ detail: 'Something went wrong while updating the table' })

  return res.status(200).send({ detail: 'Valid claim request' })
})

app.patch('/patch_player_quest_log', async (req: Request, res: Response) => {
  const body = req.body

  if (!('playerId' in body) || !('questId' in body) || !('progress' in body))
    return res.status(400).send({ detail: 'Bad request. Data missing in body' })

  const payload: any = {
    playerId: body.playerId,
    questId: body.questId,
    progress: body.progress,
    has_completed: false
  }

  // checking if the quest has been completed or not
  const questTargetObject = await getQuestTargetAmount(payload.questId)
  if (
    !('data' in questTargetObject) ||
    !('quests_by_pk' in questTargetObject.data) ||
    !('target_quantity' in questTargetObject.data.quests_by_pk)
  )
    return res.status(500).send({ detail: 'Something went wrong.' })
  const questTarget = questTargetObject.data.quests_by_pk.target_quantity
  if (payload.progress >= questTarget) payload.has_completed = true

  // graphql mutation
  const updateResult = await updatePlayerQuestLog(
    {
      progress: payload.progress,
      has_completed: payload.has_completed
    },
    payload.playerId, payload.questId
  )
  if (updateResult == null || updateResult !== 1)
    return res.status(500).send({ detail: 'Something went wrong while updating the table' })
  return res.status(200).send({ detail: 'Done!', has_completed: payload.has_completed })
})

type CreatePlayerQuestLogEntryArgs = {
  playerId: string
  questId: number
}

async function updatePlayerQuestLog(payload: any, playerId: string, questId: number) {
  const todayUTCDate = new Date().toISOString().split('T')[0]
  const todayStartTimestamp = `${todayUTCDate}T00:00:00+00:00`
  const todayEndTimestamp = `${todayUTCDate}T23:59:59+00:00`

  const _setObject: any = {}
  if ('progress' in payload) {
    _setObject.progress = payload.progress
  }
  if ('has_completed' in payload) {
    _setObject.has_completed = payload.has_completed
  }
  if ('is_reward_claimed' in payload) {
    _setObject.is_reward_claimed = payload.is_reward_claimed
  }
  if ('is_bonus_reward_claimed' in payload) {
    _setObject.is_bonus_reward_claimed = payload.is_bonus_reward_claimed
  }

  const graphql = JSON.stringify({
    query: `
    mutation update_player_quest_log {
      update_player_quest_log(
        where: {
            player_id: {_eq: "${playerId}"},
            quest_id: {_eq: ${questId}},
            created_at: {
                _gte: "${todayStartTimestamp}}",
                _lte: "${todayEndTimestamp}}"
            }
        },
        _set: {

    ` +
        (('progress' in payload) ? `progress: ${payload.progress} \n` : "\n")
      +
        (('has_completed' in payload) ? `has_completed: ${payload.has_completed} \n` : "\n")
      +
        (('is_reward_claimed' in payload) ? `is_reward_claimed: ${payload.is_reward_claimed} \n` : "\n")
      +
        (('is_bonus_reward_claimed' in payload) ? `is_bonus_reward_claimed: ${payload.is_bonus_reward_claimed} \n` : "\n")
      +
      `  }
      ) {
        affected_rows
      }
    }
    `,
    variables: {}
  })
  const requestOptions: RequestInitNF = {
    method: 'POST',
    headers: HEADERS,
    body: graphql,
    redirect: 'follow'
  }
  try {
    const responsePromise = await fetch(GRAPHQL_URL, requestOptions)
    const response: any = await responsePromise.json()
    return response.data.update_player_quest_log.affected_rows
  } catch (error) {
    console.log('error', error)
    return null
  }
}

async function getQuestTargetAmount(questId: number): Promise<any> {
  const graphql = JSON.stringify({
    query: `query MyQuery($id: Int = ${questId}) {\n  quests_by_pk(id: $id) {\n    target_quantity\n  }\n}\n`,
    variables: {}
  })
  const requestOptions: RequestInitNF = {
    method: 'POST',
    headers: HEADERS,
    body: graphql,
    redirect: 'follow'
  }
  try {
    const responsePromise = await fetch(GRAPHQL_URL, requestOptions)
    const response = responsePromise.json()
    return response
  } catch (error) {
    console.log('error', error)
  }
}

async function createPlayerQuestLogEntry(args: CreatePlayerQuestLogEntryArgs) {
  const graphql = JSON.stringify({
    query: `mutation InsertPlayerQuestLog($quest_id: Int = ${args.questId}, $player_id: String = \"${args.playerId}\") {\n  insert_player_quest_log(objects: {quest_id: $quest_id, player_id: $player_id}) {\n    affected_rows\n    returning {\n      id\n		 }\n  }\n}\n    `,
    variables: {}
  })
  const requestOptions: RequestInitNF = {
    method: 'POST',
    headers: HEADERS,
    body: graphql,
    redirect: 'follow'
  }
  try {
    const responsePromise = await fetch(GRAPHQL_URL, requestOptions)
    const response = responsePromise.json()
    return response
  } catch (error) {
    console.log('error', error)
  }
}

async function findPlayerQuestLogForToday(playerId: string, questId: number): Promise<any> {
  const todayUTCDate = new Date().toISOString().split('T')[0]
  const todayStartTimestamp = `${todayUTCDate}T00:00:00+00:00`
  const todayEndTimestamp = `${todayUTCDate}T23:59:59+00:00`

  const graphql = JSON.stringify({
    query: `query MyQuery {\n  player_quest_log(where: {player_id: {_eq: \"${playerId}\"}, quest_id: {_eq: ${questId}}, created_at: {_gte: \"${todayStartTimestamp}\", _lte: \"${todayEndTimestamp}\"}}) {\n    id\n    progress\n    has_completed\n    is_reward_claimed\n     is_bonus_reward_claimed\n  }\n}\n`,
    variables: {}
  })
  const requestOptions: RequestInitNF = {
    method: 'POST',
    headers: HEADERS,
    body: graphql,
    redirect: 'follow'
  }
  try {
    const responsePromise = await fetch(GRAPHQL_URL, requestOptions)
    const response = responsePromise.json()
    return response
  } catch (error) {
    console.log('error', error)
  }
}

async function getListOfAllActiveQuestIds(): Promise<any> {
  const graphql = JSON.stringify({
    query:
      'query MyQuery {\n  quests(where: {is_active: {_eq: true}}) {\n    id\n    target_item\n    target_quantity\n    description\n    rewards\n  }\n}\n',
    variables: {}
  })
  const requestOptions: RequestInitNF = {
    method: 'POST',
    headers: HEADERS,
    body: graphql,
    redirect: 'follow'
  }
  try {
    const responsePromise = await fetch(GRAPHQL_URL, requestOptions)
    const response = responsePromise.json()
    return response
  } catch (error) {
    return null
    console.log('error', error)
  }
}

function getRandomQuestsForToday(quests: any[], howManyQuests: number = TOTAL_QUESTS_IN_ONE_DAY) {
  // computing grouped collection grouped by target_item
  if (quests.length < howManyQuests) return []

  const groupedQuests: any = {}
  for (const quest of quests) {
    const questItem = quest.target_item
    if (!(questItem in groupedQuests)) groupedQuests[questItem] = []
    groupedQuests[questItem].push(quest)
  }

  // if item groups are less than required quests, return
  if (Object.keys(groupedQuests).length < howManyQuests) return []

  const todayUTCDate = new Date().toISOString().split('T')[0]
  const RNG = new Rand(todayUTCDate)

  // selecting `howManyQuests` groups randomly from the grouped collections
  const randomlySelectedQuestGroups: string[] = []
  const listOfItemGroups: string[] = Object.keys(groupedQuests)
  for (let iteration = 0; iteration < howManyQuests; iteration++) {
    const randomNumber = RNG.next()
    const randomIndex = Math.floor(randomNumber * listOfItemGroups.length)
    randomlySelectedQuestGroups.push(listOfItemGroups.splice(randomIndex, 1)[0])
  }

  const randomlySelectedQuests: any[] = []
  for (const questGroupName of randomlySelectedQuestGroups) {
    const questGroup = groupedQuests[questGroupName]
    const randomNumber = RNG.next()
    const randomIndex = Math.floor(randomNumber * questGroup.length)
    randomlySelectedQuests.push(questGroup[randomIndex])
  }
  return randomlySelectedQuests
}

async function findAllPlayerQuestLogsForToday(playerId: string) {
  const todayUTCDate = new Date().toISOString().split('T')[0]
  const todayStartTimestamp = `${todayUTCDate}T00:00:00+00:00`
  const todayEndTimestamp = `${todayUTCDate}T23:59:59+00:00`

  const graphql = JSON.stringify({
    query: `query MyQuery {\n  player_quest_log(where: {player_id: {_eq: \"${playerId}\"}, created_at: {_gte: \"${todayStartTimestamp}\", _lte: \"${todayEndTimestamp}\"}}) {\n    id\n    progress\n    has_completed\n  }\n}\n`,
    variables: {}
  })
  const requestOptions: RequestInitNF = {
    method: 'POST',
    headers: HEADERS,
    body: graphql,
    redirect: 'follow'
  }
  try {
    const responsePromise = await fetch(GRAPHQL_URL, requestOptions)
    const response = responsePromise.json()
    return response
  } catch (error) {
    console.log('error', error)
  }
}

async function markBonusRewardClaimedInDB(playerId: string) {
  const todayUTCDate = new Date().toISOString().split('T')[0]
  const todayStartTimestamp = `${todayUTCDate}T00:00:00+00:00`
  const todayEndTimestamp = `${todayUTCDate}T23:59:59+00:00`

  const graphql = JSON.stringify({
    query: `
    mutation update_player_quest_log {
      update_player_quest_log(
        where: {
            player_id: {_eq: "${playerId}"},
            created_at: {
                _gte: "${todayStartTimestamp}}",
                _lte: "${todayEndTimestamp}}"
            }
        },
        _set: {
          is_bonus_reward_claimed: true
        }
      ) {
        affected_rows
      }
    }
    `,
    variables: {}
  })
  const requestOptions: RequestInitNF = {
    method: 'POST',
    headers: HEADERS,
    body: graphql,
    redirect: 'follow'
  }
  try {
    const responsePromise = await fetch(GRAPHQL_URL, requestOptions)
    const response: any = await responsePromise.json()
    return response.data.update_player_quest_log.affected_rows
  } catch (error) {
    console.log('error', error)
    return null
  }
}

export { app }
