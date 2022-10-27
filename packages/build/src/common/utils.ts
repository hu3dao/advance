import fs from 'fs'
import { pathToFileURL } from 'node:url'
import {NODE_VERSION, MPA_CONFIG_FILE} from './constant.js'
import {IMpaConfig} from '../types/index.js'

// 判断文件是否存在
const isExist = (path: string) => {
  return fs.existsSync(path)
}

// 读取配置文件
const resolveConfig = async (command: 'dev'|'build', mode:'development'|'production'|string): Promise<IMpaConfig> => {
  try {
    const res = (await import(pathToFileURL(MPA_CONFIG_FILE).href)).default
    if(typeof res === 'function') {
      return res({command, mode})
    } else if(typeof res === 'object') {
      return res
    } else {
      return {}
    }
  } catch(error) {
    return {}
  } 
}

// 判断node版本是否符合条件
const ckeckNodeVersion = (targetNodeVersion: string) => {
  if(!targetNodeVersion) return false
  const c = NODE_VERSION.replace(/[^0-9.]/, '').split('.')
  const t = targetNodeVersion.replace(/[^0-9.]/, '').split('.')
  let result:number
  let i = 0
  while(true) {
    const c1 = c[i]
    const t1 = t[i++]
    if(c1 === undefined || t1 === undefined) {
      result = (+c1 || 0) - (+t1 || 0)
      break
    }
    if(c1 === t1) continue
    result = (+c1) - (+t1)
    break
  }
  return result >= 0
}

export {
  isExist,
  resolveConfig,
  ckeckNodeVersion
}