import axios from 'axios'

export default axios.create({
    baseURL: SERVER,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})