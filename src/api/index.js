import axios from 'axios'
import { alert } from '../lib/dialog'

const ROOT = 'http://api.journeynes.com'

function config(query) {
    const config = {
        baseURL: ROOT,
        transformResponse: [function (data) {
            let result = JSON.parse(data)
            if (result.errno) alert(result.errorMsg)
            return result
        }]
    }
    if (query) {
        config.params = query
    }
    return config
}

export default {
    getNoteList: function () {
        return axios.get('/piece/list', config())
    },
    getNoteDetail: function (data) {
        return axios.get(`/piece/${data}/detail`, config())
    }
}
