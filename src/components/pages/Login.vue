<template>
  <div id="login-page">
    <div class="hd">
      <img :src="bgimg_url" alt="none">
      <div class="login-item">
        <div class="login-btn" @touchstart="showLoginFrom">手机号登录</div>
        <div class="login-btn">注册</div>
        <div class="no-login" @touchstart="intoMain">游客试用</div>
      </div>
    </div>
    <div class="footer">
      <div class="title">
        <span>其他登录方式</span>
      </div>
      <div class="login-way">
        <div @touchstart="changeIconState(index)" @touchend="noneIconState" class="login" v-for="(item, index) in icon_url" :key="index">
          <img :src="iconState === index ? item.icon_active : item.icon" alt="none">
          <div class="icon-title">
            {{item.text}}
          </div>
        </div>
      </div>
    </div>
	  <router-view></router-view>
  </div>
</template>

<script>
	import LoginForm from './LoginForm'
  export default {
    name: 'Login',
    data() {
      return {
        iconState: 5,
        bgimg_url: require('@/assets/img/ic_launcher2.png'),
	      icon_url: [
        {
          icon: require('@/assets/img/akw@2x.png'),
          icon_active: require('@/assets/img/akx@2x.png'),
          text: '微信'
        },
        {
          icon: require('@/assets/img/aks@2x.png'),
          icon_active: require('@/assets/img/akt@2x.png'),
          text: 'QQ'
        },
        {
          icon: require('@/assets/img/aku@2x.png'),
          icon_active: require('@/assets/img/akv@2x.png'),
          text: '微博'
        },
        {
          icon: require('@/assets/img/akp@2x.png'),
          icon_active: require('@/assets/img/akq@2x.png'),
          text: '网易邮箱'
        }
      ]
      }
    },
	  components: {
        LoginForm
	  },
	  methods: {
      showLoginFrom() {
        if (navigator.onLine) {
          console.log('网络在线')
	        this.$router.push({
		        path: '/login/loginForm'
	        })
        } else {
          console.log('网络呵呵')
        }
      },
      intoMain() {
	      this.$router.push({
		      path: '/'
	      })
      },
      noneIconState() {
	      this.iconState = 5
	    },
	    changeIconState(i) {
	      this.iconState = i
	    }
	  }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#login-page {
  width: 100%;
	height: 100%;
	z-index: 5;
  position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
  background-color: white;
  .hd {
    width: 100%;
    height: 300px;
    background-image: url("../../assets/img/ak7.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 72px;
      height: 72px;
    }
    .login-item {
      width: 80%;
      margin: 35px;
      height: 70px;
      .login-btn {
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin: 15px auto;
        border: 1px solid red; /*no*/
        color: red;
        border-radius: 25px;
        font-size: 16PX;
      }
	    .no-login {
		    color: gray;
		    font-size: 12px;
		    text-align: center;
		    text-decoration: underline;
	    }
    }
  }
	.footer {
		width: 100%;
		height: 300px;
		bottom: 0;
		left: 0;
		position: fixed;
		.title {
			width: 100%;
	    margin-top: 150px;
	    font-size: 14PX;
	    text-align: center;
			span {
				position: relative;
				&:before {
					content: "";
	        position: absolute;
	        top: 50%;
	        left: 0;
	        width: 20px;
	        border-top: 1PX solid gray;
	        transform: translate3d(-150%,-50%,0);
				}
	      &:after {
		      content: "";
	        position: absolute;
	        top: 50%;
	        right: 0;
	        width: 20px;
	        border-top: 1PX solid gray;
	        transform: translate3d(150%,-50%,0);
	      }
			}
		}
		.login-way {
			width: 100%;
	    margin-top: 20px;
			font-size: 0;
	    bottom: 0;
	    display: flex;
	    justify-content: space-around;
			.login {
				display: inline-block;
	      width: 50px;
	      height: 100%;
	      text-align: center;
				img {
					width: 100%;
					height: 60%;
				}
				.icon-title {
					margin-top: 10px;
					font-size: 12px;
				}
			}
		}
	}
}
</style>
