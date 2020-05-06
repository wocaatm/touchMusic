import { SWITCH_PIECE_DATA, INIT_PIECE_LIST, SHOW_NOTIFY_MSG, STORE_NOTE_RESOURCE, SWITCH_PIECE_ONOFF } from '../types'
import { decodeNote } from '../../lib/util'

const noteFromLocalStorage = function () {
    let note = localStorage.getItem('note')
    if (note) {
        return decodeNote(JSON.parse(note))
    } else {
        return false
    }
}

const state = {
    noteArray: noteFromLocalStorage() || [],
    noteList: [],
    notify: '',
    pieceId: '',
    perform: 0,
    onOff: 0
}

const mutations = {
    [SWITCH_PIECE_DATA] (state, data) {
        state.pieceId = data.pieceid
        state.perform = data.perform
        state.onOff = data.onOff
    },
    [INIT_PIECE_LIST] (state, list) {
        state.noteList = list
        state.pieceId = list[0].data[0]._id
    },
    [SHOW_NOTIFY_MSG] (state, msg) {
        state.notify = msg
    },
    [STORE_NOTE_RESOURCE] (state, note) {
        state.noteArray = decodeNote(note)
        localStorage.setItem('note', JSON.stringify(note))
    },
    [SWITCH_PIECE_ONOFF] (state, flag) {
        state.onOff = flag
    }
}

export default {
    state,
    mutations
}