export default {
  "entry": "main.ts",
  "template": "index.html",
  "injectScript": "",
  "copyStatic": [
    {
      "from": "static",
      "to": "dist/static"
    },
    {
      "from": "config",
      "to": "dist"
    }
  ]
}