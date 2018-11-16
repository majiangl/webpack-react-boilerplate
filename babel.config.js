module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                // Do not transform ES6 modules
                "modules": false,
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