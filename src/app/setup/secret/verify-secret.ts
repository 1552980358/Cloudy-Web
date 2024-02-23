import axios, {AxiosError} from 'axios'

interface Response {
    has_owner: boolean,
}

const getErrorMessage = (error: AxiosError): string => {
    if (error.response) {
        switch (error.response.status) {
            case 401: {
                return 'response.401';
            }
            case 405: {
                return 'response.405';
            }
            default: {
                return 'response.unknown';
            }
        }
    }
    return error.request ? 'connection' : 'internal';
}

export default (
    secret: string,
    uiState: { error: string },
    onComplete: (hasOwner: boolean | null) => void,
) => {
    axios.get(`/setup?secret=${secret}`)
        .then((response) => response.data as Response)
        .then((response) => response.has_owner)
        .then(onComplete)
        .catch((error: AxiosError) => {
            uiState.error = getErrorMessage(error);
            onComplete(null);
        });
};