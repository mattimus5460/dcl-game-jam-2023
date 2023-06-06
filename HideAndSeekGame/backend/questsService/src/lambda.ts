// import "source-map-support/register";
import serverlessExpress from '@vendia/serverless-express'
import { app } from './index'

export const handler = serverlessExpress({ app })
