<template>
  <div id="app">
    <m-header @showPopUp="showPopup"></m-header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <van-popup v-model="show" position="left">
      <detail @hidePopup="hidePopup" @showLogin="showLogin"></detail>
    </van-popup>
	  <player></player>
	  <message v-if="messShow" ></message>
	  <div class="bottom-content" v-show="uid!==-1 && playlist.length === 0">
		  暂无音乐播放
	  </div>
  </div>
</template>

<script>
	import Player from './components/component/player'
  import Login from './components/pages/Login'
  import MHeader from './components/component/MHeader'
  import Detail from './components/component/Detail'
  import {getCookie} from '@/assets/js/cookies'
  import { mapMutations, mapState } from 'vuex'
  import Message from "./components/component/Message";
  export default {
    name: 'App',
    created() {
      this.checkLogin()
    },
    data() {
      return {
        show: false,
	      headerShow: false
      }
    },
	  computed: {
      ...mapState({
	      playlist: 'playlist',
	      uid: "uid",
	      messShow: 'messShow'
      })
	  },
    components: {
      Message,
      Detail,
      MHeader,
      Login,
	    Player
    },
    methods: {
      ...mapMutations({
        setUid: 'SET_UID',
        setUserInfo: 'SET_USERINFO'
      }),
      checkLogin() {
        if (!getCookie('MUSIC_U')) {
          console.log('wscdxazqe')
	        this.$router.push({
		        path: '/login'
	        })
        } else {
          this.headerShow = true
          let uid = localStorage.getItem('uid')
          let userInfo = localStorage.getItem('userInfo')
          this.setUid(+uid)
          this.setUserInfo(JSON.parse(userInfo))
        }
      },
      showPopup() {
        this.show = true
      },
	    hidePopup() {
        this.show = false
      },
      showLogin() {
        this.show = false
        this.$router.push({
	        path: '/login'
        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#app {
  overflow-x: hidden;
  .bottom-content {
	  line-height: 60px;
	  padding-left: 20px;
	  font-size: 20px;
	  width: 100%;
	  height: 60px;
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  z-index: 360;
	  background: lightpink;
	  color: lavender;
  }
}
</style>
