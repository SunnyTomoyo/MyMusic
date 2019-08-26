<template>
  <div id="detail">
    <div class="top-login">
      <div class="login" v-if="uid === ''">
        <span>
          登录网易云音乐
        </span>
        <span>
          手机电脑多端同步，尽享海量高品质音乐
        </span>
        <div @touchstart="showLogin">
          立即登录
        </div>
      </div>
      <div class="myself" v-else ref="myself" :style="{
        backgroundImage: 'url(' + userInfo.backgroundUrl + ')'
      }">
          <img :src="userInfo.avatarUrl" alt="none" @click="getMyself">
          <div class="nickname">
            {{userInfo.nickname}}
          </div>
      </div>
    </div>
    <div class="choice">
	    <div class="top-part">
				<div class="item" v-for="(item, i) in iconArr" :key="i">
					<img :src="item.icon" alt="none"/>
					<div class="text">{{item.text}}</div>
				</div>
	    </div>
	    <div class="list-part">
		    <div class="items" v-for="(item, index) in listArr" :key="index">
			    <img :src="item.icon" alt="none">
			    <div class="item-text">{{item.text}}</div>
		    </div>
	    </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'Detail',
	  data() {
      return {
        listArr: [{
          icon: require('@/assets/img/bai.png'),
	        text: '小冰电台'
        },{
          icon: require('@/assets/img/baj.png'),
	        text: '口袋铃声'
        },{
          icon: require('@/assets/img/bak.png'),
	        text: '亲子频道'
        },{
          icon: require('@/assets/img/bal.png'),
	        text: '古典专区'
        },{
          icon: require('@/assets/img/bam.png'),
	        text: '定时停止播放'
        },{
          icon: require('@/assets/img/ban.png'),
	        text: '音乐云盘'
        },{
          icon: require('@/assets/img/bap.png'),
	        text: '优惠券'
        },{
					icon: require('@/assets/img/baz.png'),
	        text: '夜间模式'
        },{
          icon: require('@/assets/img/bar.png'),
	        text: '在线听歌免流量'
        },{
          icon: require('@/assets/img/bat.png'),
	        text: '游戏推荐'
        },{
          icon: require('@/assets/img/bax.png'),
	        text: '加入网易音乐人'
        },{
          icon: require('@/assets/img/bay.png'),
	        text: '附近的人'
        },{
	        icon: require('@/assets/img/baq.png'),
	        text: '退出'
        }],
        iconArr: [{
          icon: require('@/assets/img/baw.png'),
          text: '我的消息'
        },{
          icon: require('@/assets/img/bas.png'),
          text: '我的好友'
        },{
          icon: require('@/assets/img/bb2.png'),
          text: '个性换肤'
        },{
          icon: require('@/assets/img/bau.png'),
          text: '听歌识曲'
        }]
      }
	  },
    computed: {
      ...mapState({
        uid: 'uid',
        userInfo: 'userInfo'
      })
    },
    methods: {
      showLogin() {
        this.$emit('showLogin')
      },
      getMyself() {
        this.$emit('hidePopup')
        this.$router.push({
          path: '/myself'
        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  #detail {
    width: 300px;
    /*height: 667px;*/
    /*background: greenyellow;*/
    .top-login {
      width: 100%;
      height: 167px;
      .login {
        width: 100%;
        height: 100%;
        background-image: url("../../assets/img/aww.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        letter-spacing: 2px;
        span {
          font-size: 13px;
          color: mintcream;
        }
        div {
          width: 150px;
          height: 30px;
          line-height: 30px;
          vertical-align: middle;
          margin-top: 10px;
          text-align: center;
          font-size: 15px;
          color: white;
          border-radius: 15px;
          border: 1px solid gray;
        }
      }
      .myself {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        img {
          border-radius: 50%;
          width: 75px;
          height: 75px;
          margin-left: 20px;
        }
        .nickname {
          font-size: 18px;
          color: white;
          margin-top: 20px;
          margin-left: 20px;
        }
      }
    }
	  .choice {
		  width: 100%;
		  box-sizing: border-box;
		  padding: 15px 10px 0 10px;
		  .top-part {
			  border-bottom: 1PX solid grey;
			  font-size: 12px;
			  padding-bottom: 10px;
			  /*background: lightsalmon;*/
			  display: flex;
			  text-align: center;
			  justify-content: space-between;
			  .item {
				  width: 48px;
				  img {
					  color: red;
					  width: 28px;
					  height: 28px;
					  /*background: lightseagreen;*/
				  }
				  .text {
					  margin-top: 5px;
				  }
			  }
		  }
		  .list-part {
			  padding-top: 20px;
			  width: 100%;
			  font-size: 12px;
			  .items {
				  margin-bottom: 15px;
				  img {
					  width: 24px;
					  height: 24px;
					  vertical-align: top;
					  margin-right: 10px;
				  }
				  .item-text {
					  line-height: 24px;
					  font-size: 16px;
					  display: inline-block;
				  }
			  }
		  }
	  }
  }
</style>
