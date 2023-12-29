import axios from 'axios'

interface ResponseBody {
    id: string,
    username: string,
    nickname: string,
}

export const usernameGet = async (username: string) => {
    return axios.get(`/account/username/${username}`)
        .then((response) => response.data as ResponseBody)
}