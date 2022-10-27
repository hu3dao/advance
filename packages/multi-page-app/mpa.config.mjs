export default (params) => {
  return {
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
