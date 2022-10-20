export default {
  "entry": "main.js",
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