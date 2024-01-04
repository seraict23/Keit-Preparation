module.exports = async function asyncTimeout(message, time) {
    console.log(message)
    return new Promise((callback, j) =>{
        setTimeout(callback, time)
    })
}
