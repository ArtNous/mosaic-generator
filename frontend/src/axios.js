import axios from 'axios'

const ax = axios.create({
    baseURL: SERVER,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default ax