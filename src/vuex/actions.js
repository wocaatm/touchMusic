import * as types from './types'
import Api from '../api/index'

/* 获取piece模块的pieceList */
export const getPieceList = ({ commit }) => {
    return Api.getNoteList()
            .then(function (response) {
                commit(types.INIT_PIECE_LIST, response.data)
            })
}