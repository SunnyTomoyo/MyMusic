import * as types from './mutation-types'


const matutaions = {
  [types.SET_UID](state, uid) {
    state.uid = uid
  },
  [types.SET_USERINFO](state, userInfo) {
    state.userInfo = userInfo
    console.log(state.userInfo)
  },
  [types.SET_PLAYLIST](state, playlist) {
    state.playlist = playlist
    console.log(state.playlist)
  },
  [types.SET_PLAYINGSONG](state, item) {
    state.playingSong = item
    console.log(state.playingSong)
  },
  [types.SET_CURRENTINDEX](state, index) {
    state.currentIndex = index
    console.log(state.currentIndex)
  },
  [types.SET_SONGURL](state, url) {
    state.songUrl = url
    console.log(state.songUrl)
  },
  [types.SET_LASTSHARE](state, num) {
    state.lastShare = num
    console.log(state.lastShare)
  },
  [types.SET_MODE](state) {
    state.modeNum++
    if (state.modeNum === 3) {
      state.modeNum = 0
    }
    console.log(state.modeNum)
  },
  [types.SET_MESS](state, obj) {
    state.mess = obj
    console.log(state.mess)
  },
  [types.SET_MESSSHOW](state) {
    state.messShow = !state.messShow
    console.log(state.messShow)
  }
}

export default matutaions
