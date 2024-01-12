import Time from '../interfaces/timeInterface';

async function delay(time: Time) {
    return new Promise((resolve, _) => {
        setTimeout(resolve, time.second)
    })
}

export default delay;