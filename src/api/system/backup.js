import axios from '@utils/http';

// get
export function getData(data) {
    return axios.get(`/mock/list.json`, { params: data }).then(res => {
        return Promise.resolve(res);
    });
}
