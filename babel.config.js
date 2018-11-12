module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": "55",
          "firefox": "52",
          "safari": "9",
          "ie": "11"
        },
        // 按需添加babel-polyfill，减少转码文件大小
        "useBuiltIns": false
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": [
    "@babel/plugin-transform-runtime"
  ]
};