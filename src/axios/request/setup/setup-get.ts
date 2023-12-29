import axios from 'axios'

interface ResponseBody {

    has_owner: boolean,

}

export const setupGet = async (secret: string) => {
    return axios.get(`setup?secret=${secret}`)
        .then((response) => response.data as ResponseBody)
}