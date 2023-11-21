import fs from 'fs-extra'
import path from 'path'

const getFilesPaths = async dir => {
  const files = await fs.readdir(dir)

  const paths = await Promise.all(
    files.map(async file => {
      const filePath = path.join(dir, file).replace(/\\/g, '/')
      const stat = await fs.stat(filePath)

      if (stat.isFile()) {
        if (filePath !== 'files/.gitkeep') return filePath
      } else {
        return getFilesPaths(filePath)
      }
    })
  )

  return paths.filter(e => e).reduce((acc, curr) => acc.concat(curr), [])
}

/**
 * 获取语言配置
 * */
export const getLangConfig = async () => {
  const files = await getFilesPaths('lang')
  return files.reduce((res, key) => Object.assign(res, { [key.replace(/\..+/, '')]: key }), {})
}
