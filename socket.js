const { Server } = require('socket.io')

let io;

module.exports = {
    init: (server) => {
        io = new Server(server)
        return io
    },
    getIO: () => {
        if (!io) {
            console.log('Socket.io is not initialized!')
            return null
        }
        return io
    }
}