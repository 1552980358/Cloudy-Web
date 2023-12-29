import axios from 'axios'

const buildPostBody = (username: string, password: string) => {
    return { username: username, password: password }
}

export const authPost = async (username: string, password: string, duration?: number | null) => {
    const postBody = buildPostBody(username, password)
    const query = !!duration ? `?duration=${duration}` : ''
    return axios.post(`/auth${query}`, postBody)
        .then((response) => response.data as string)
}