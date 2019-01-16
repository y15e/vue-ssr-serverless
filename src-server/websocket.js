import config from '../config/server'
import mongo from './mongo'
import CustomStorage from './CustomStorage'
import cookie from 'cookie'
import * as wsPool from './websocket-pool'

// https://github.com/aws-amplify/amplify-js/issues/493#issuecomment-386161756
import fetch from 'node-fetch'
global.fetch = global.fetch || fetch

import AWS from 'aws-sdk'
import Amplify, { Auth } from 'aws-amplify'
import aws_exports from '../src/aws-exports'
Amplify.configure(aws_exports)

async function callAPI (event) {
  
  const db = await mongo.connect(config.mongo_url)
  
  if (event.requestContext.eventType == 'CONNECT') {
    
    // CONNECT
    const cookies = event.isOffline
          ? cookie.parse(event.headers.cookie)
          : cookie.parse(event.headers.Cookie)
    
    Amplify.configure({ Auth: { storage: new CustomStorage(cookies) } })
    
    const userInfo = await Auth.currentUserInfo()
    const user_id = parseInt(userInfo.attributes['custom:user_id'])
    
    console.log('[websocket.js] user_id: ' + user_id)
    
    return wsPool.add(user_id, event)
    
  } else if (event.requestContext.eventType == 'MESSAGE') {
    
    // MESSAGE
    const parsedBody = JSON.parse(event.body)
    const payload = parsedBody.data
    const api = require('./api/index.js')
    const result = await api[payload.action](payload)
    const data = {
      job_id: parsedBody.job_id,
      resolve: result
    }
    
    if (event.isOffline) {
      
      // offline
      return data
      
    } else {
      
      // production
      let wsClient = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: 'https://kbm6sisjkh.execute-api.us-east-1.amazonaws.com/dev/'
      })
      
      await wsClient.postToConnection({
        ConnectionId: event.requestContext.connectionId,
        Data: JSON.stringify(data)
      }).promise().catch(err => {
        console.log('[postToConnection ERROR]')
        console.log(err)
      })
      
      return
    }
  }
  
}

export default callAPI
