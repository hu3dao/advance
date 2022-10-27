import fs from 'fs'
import path from 'path'
import {NODE_VERSION} from './constant.js'

// 判断文件是否存在
const isExist = (path: string) => {
  return fs.existsSync(path)
}

// 复制
const copy = (srcDir: string, desDir: string) => {
  const sourceFile = fs.readdirSync(srcDir, { withFileTypes: true })
  for (const file of sourceFile) {
    // 源文件 地址+文件名
    const srcFile = path.resolve(srcDir, file.name)
    // 目标文件
    const tagFile = path.resolve(desDir, file.name)
    // 文件是目录且未创建
    if (file.isDirectory() && !fs.existsSync(tagFile)) {
      fs.mkdirSync(tagFile)
      copy(srcFile, tagFile)
    } else if (file.isDirectory() && fs.existsSync(tagFile)) {
      // 文件时目录且已存在
      copy(srcFile, tagFile)
    }
    !file.isDirectory() && fs.copyFileSync(srcFile, tagFile, fs.constants.COPYFILE_FICLONE)
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
  copy,
  ckeckNodeVersion
}