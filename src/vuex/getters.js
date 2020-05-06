/* 获取首页ArrayBuffer */
export const getNoteArray = (state) => state.piece.noteArray

/* 获取首页notify */
export const getNotify = (state) => state.piece.notify

/* 获取首页正在弹奏的曲子 */
export const getPieceId = (state) => state.piece.pieceId

/* 首页曲子是自己弹还是play rhythm */
export const getPerform = (state) => state.piece.perform

/* 首页触发新曲子的flag */
export const getOnOffFlag = (state) => state.piece.onOff

/* 首页piece模块的noteList */
export const noteList = (state) => state.piece.noteList