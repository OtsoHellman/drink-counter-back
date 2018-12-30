
const userHandler = require('../services/user')

let emitSocketAllWithKonniInterval
let ws

const emitAllWithKonni = () => {
    userHandler.allWithKonni()
        .then((konni) => {
            ws.emit("allWithKonni", {
                data: konni
            })
        })
}

exports.emitAllWithKonni = emitAllWithKonni

exports.initialize = (wsConnection) => {
    ws = wsConnection
    emitAllWithKonni(ws)
    emitSocketAllWithKonniInterval = setInterval(() => emitAllWithKonni(ws),1000)
}

exports.close = () => {
    clearInterval(emitSocketAllWithKonniInterval)
}
