import axios from 'axios'

export default axios.create({
    baseURL: SERVER,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
})