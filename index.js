const express = require("express")
const app = express()　
const { createProxyMiddleware } = require("http-proxy-middleware")
const rateLimit = require("express-rate-limit")
require("dotenv").config()
const url = require("url")

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
})

// app.use(limiter)

app.get("/", (req, res) => {
    res.send("This is my proxy server")
    // console.log("process.env.BASE_API_URL=",process.env.BASE_API_URL)
    // const params = url.parse(req.url).query
    // console.log(params)
})

//ChatGPTケース
app.use("/corona-tracker-world-data", limiter ,createProxyMiddleware({
    // target: "https://monotein-books.vercel.app",
    target: process.env.BASE_API_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/$' : '/api/corona-tracker/summary'  //これならOK。ただパスは固定！！！！
        // "^/corona-tracker-world-data": "/api/corona-tracker/summary",
    },
    logLevel: "debug",
}))


const port = process.env.PORT || 5000

app.listen(5000, () => {
    // console.log("Listening on localhost port 5000")
    console.log(`Listening on localhost port ${port}`)
})

module.export = app

//オリジナル
// app.use("/corona-tracker-world-data", (req, res, next) => {
//     // ⬇追加
//     createProxyMiddleware({
//         target: "https://monotein-books.vercel.app/api/corona-tracker/summary",
//         changeOrigin: true,
//         pathRewrite: {
//             [`^/corona-tracker-world-data`]: "",
//         },
//     })(req, res, next)
//     // ⬆追加
// })

//ChatGPT OKケース（常に固定のエンドポイント）
// app.use("/corona-tracker-world-data", createProxyMiddleware({
//     target: "https://monotein-books.vercel.app",
//     changeOrigin: true,
//     pathRewrite: (path, req) => {
//         // 常に固定のエンドポイントに変換
//         return "/api/corona-tracker/summary"
//     },
//     logLevel: "debug", // デバッグ出力
// }))
