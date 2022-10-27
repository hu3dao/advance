// command执行的命令：dev   build
// mode模式：dev对应的development    build对应的  production    可以通过命令行参数--mode自定义 
export default ({ command, mode }) => {
  // if(command === 'dev') {
  // dev命令下的配置
  // } else if(command === 'build') {
  // build命令下的配置
  // }
  console.log(mode);
  return {
    "root": "src/pages",  // 入口目录，相对于根目录
    "entry": "main.ts",
    "template": "index.html",
    "injectScript": "",
    "copyStatic": [
      {
        "from": "config",
        "to": "dist"
      }
    ]
  }
}
