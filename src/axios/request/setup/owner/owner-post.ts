import axios from 'axios'

export const ownerPost = async (
    secret: string,
    username: string,
    password: string,
    nickname: string,
    avatar: string
) => {
    let postBody = {
        username: username,
        password: password,
        nickname: nickname,
        avatar: avatar,
        role: 'owner',
    }
    return axios.post(`setup/owner?secret=${secret}`, postBody)
}