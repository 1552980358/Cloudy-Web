import axios from 'axios'

interface ResponseBody {
    id: string,
    username: string,
    nickname: string,
}

export const ownerGet = async () => {
    return axios.get('setup/owner')
        .then((response) => response.data as ResponseBody)
}