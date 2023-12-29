import axios from 'axios'

const buildRequestOption = (token: string | undefined) => {
    if (!!token) {
        return { headers: { Authorization: `JWT ${token}` } }
    } else {
        return null
    }
}

interface ResponseBody {
    id: string,
    username: string,
    nickname: string,
}

export const accountGet = async (token?: string) => {
    const requestOption = buildRequestOption(token)
    return axios.get('/account', requestOption)
        .then((response) => response.data as ResponseBody)
}

export default accountGet