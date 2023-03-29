import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://localhost/api'
});

instance.defaults.headers.common['Authorization'] = 'AUTH_TEST';

export default instance;
