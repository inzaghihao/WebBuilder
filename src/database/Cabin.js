import express from 'express'

export default class Cabin {
    info = {}
    communication = null // null: Electron的IPC通信, express(): Express包装的HTTP通信
    constructor(SOCKET_NUMBER) {
        this.initCabin(SOCKET_NUMBER)
    }
    // ============================================================================================================
    // ============================================================================================================
    // ============================================================================================================
    // ============================================================================================================
    // ============================================================================================================
    // 数据接口分配
    exposeLink(method, route, next) {
        if (this.info.SOCKET_NUMBER) {
            if (method === 'GET') {
                this.communication.get(route, (request, response) => next(request, response))
            }
            if (method === 'POST') {
                this.communication.post(route, require('body-parser').json(), (request, response) => next(request, response))
            }
        }
    }
    // HTML分配
    exposeHtml(route, htmlPath) {
        if (this.info.SOCKET_NUMBER) {
            // const vuePath = require('path').join(__dirname, '../dist')
            // this.communication.use(express.static(vuePath))
            // this.communication.get('/sjShop', (request, response) => response.sendFile(`${vuePath}/sjShop.html`))
            this.communication.use(express.static(htmlPath))
            this.communication.get(route, (request, response) => response.sendFile(htmlPath))
        }
    }
    // ============================================================================================================
    // ============================================================================================================
    // ============================================================================================================
    // ============================================================================================================
    // ============================================================================================================
    // 把调度员的方法绑定到Cabin上
    bindDispatcher(TargetClassName, TargetClass) {
        if (this.__proto__ && TargetClass.prototype) {
            // 1.在this的原型上创建目标对象
            this.__proto__[TargetClassName] = new TargetClass()
            // 2.在this的原型上绑定目标对象的所有方法
            Object.getOwnPropertyNames(TargetClass.prototype).forEach((functionName) => {
                if (functionName === 'docs') return // continue
                if (functionName === 'constructor') return // continue
                this.__proto__[functionName] = (...args) => {
                    let origin = this.__proto__[TargetClassName]
                    return origin[functionName].apply(origin, args)
                }
            })
        }
    }
    // ============================================================================================================
    // ============================================================================================================
    // ============================================================================================================
    // ============================================================================================================
    // ============================================================================================================
    initCabin(SOCKET_NUMBER) {
        try {
            this.#initInfo(SOCKET_NUMBER)
            this.#initCommunication()
        } catch (error) {
            console.log(error.message)
            process.exit()
        }
    }
    // 初始化该控制台信息
    #initInfo(SOCKET_NUMBER) {
        // 服务端口
        this.info['SOCKET_NUMBER'] = SOCKET_NUMBER
        // 本机IPv4地址
        if (global.process.platform === 'win32') {
            const interfaces = require('os').networkInterfaces()
            for (let index in interfaces) {
                if (index === '以太网') {
                    for (let key in interfaces[index]) {
                        let value = interfaces[index][key]
                        if (value.family === 'IPv4') {
                            this.info['IPv4'] = value.address
                            break
                        }
                    }
                    break
                }
            }
        }
    }
    // 初始化控制台通信核心
    #initCommunication() {
        if (this.info.SOCKET_NUMBER) {
            this.communication = express()
            this.communication.all('*', (req, res, next) => {
                res.header('Access-Control-Allow-Origin', '*')
                res.header('Access-Control-Allow-Headers', '*')
                res.header('Access-Control-Allow-Methods', '*')
                next()
            })
            this.communication.listen(this.info.SOCKET_NUMBER)
        }
    }
}
