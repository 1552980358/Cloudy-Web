import axios from 'axios'

interface ResponseBody {
    id: string,
    nickname: string,
    username: string,
    email: string,
}

const allowBlankResponseOption = (allowBlankResponse: boolean) => {
    return allowBlankResponse ? '?allow_blank_response' : ''
}

export const findGet = async (accountIdentifier: string, allowBlankResponse: boolean = false) => {
    const url = `account/find/${accountIdentifier}${allowBlankResponseOption(allowBlankResponse)}`
    return axios.get(url)
        .then((response) => {
            const data = response.data
            return !!data ? data as ResponseBody : null
        })
}

export default findGet