<template>
  <div id="login-form">
		<div class="head">
			<div class="icon" @click="back">
				<i class="iconfont icon-fanhui"></i>
			</div>
			手机号登录
		</div>
	  <div class="body">
		  <div class="body-item" style="padding-left: 13px">
			  +86
			  <input class="input-control" type="text" v-model="tel" placeholder="请输入手机号">
		  </div>
			<div class="body-item">
			  <input class="input-control" type="password" v-model="password" placeholder="请输入密码">
		  </div>
		  <div class="body-submit" @click="loginAccount">
			  登录
		  </div>
	  </div>
		<van-loading class="loading-container" v-show="isLoading"/>
  </div>
</template>

<script>
	import { mapMutations } from 'vuex'
	export default {
		name: 'LoginForm',
		data() {
	    return {
				tel: '',
				password: '',
		    isLoading: false
			}
		},
		methods: {
		  ...mapMutations({
        setUid: 'SET_UID',
			  setUserInfo: 'SET_USERINFO'
      }),
	    back() {
	      this.$router.go(-1)
	    },
			loginAccount() {
		    if (!this.isLoading && this.tel && this.password) {
		      this.isLoading = true
		      let add = `/api/login/cellphone?phone=${this.tel}&password=${this.password}`
			    this.axios.post(add).then(res => {
					  var data = res.data
					  console.log(data)
				    if (data.code === 200) {
				      this.setUid(data.account.id)
							localStorage.setItem('uid', data.account.id)
					    this.isLoading = false
					    this.$dialog.alert({message: '登录成功'})
					    var obj = {}
					    obj['nickname'] = data.profile.nickname
					    obj['avatarUrl'] = data.profile.avatarUrl
					    obj['backgroundUrl'] = data.profile.backgroundUrl
					    console.log(obj)
					    localStorage.setItem('userInfo', JSON.stringify(obj))
					    this.setUserInfo(obj)
					    this.$router.push({
						    path: '/'
					    })
				    }
					}).catch(err => {
					  console.log(err)
				    this.isLoading = false
				    this.$dialog.alert({message: '登录失败'})
					})
		    }
			}
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#login-form {
	position: absolute;
	width: 100%;
	height: 667px;
	background: #eeeeee;
	z-index: 14;
	top: 0;
	left: 0;
	font-size: 16px;
	.head {
		width: 100%;
		height: 50px;
		font-size: 16px;
		color: white;
		background: #dddddd;
		.icon {
			width: 40px;
			height: 80px;
			line-height: 50px;
			text-align: center;
			display: inline-block;
			i {
				font-size: 22px;
			}
		}
	}
	.body {
		margin-top: 100px;
		.body-item {
			width: 80%;
			height: 36px;
			background: #eeeeee;
			border-bottom: 1PX solid silver;
			margin: 0 auto 40px;
			font-size: 16px;
			.input-control {
				padding-left: 13px;
				line-height: 36px;
				color: black;
				width: 200px;
				height: 36px;
				margin-bottom: 30px;
			}
		}
		.body-submit {
			width: 80%;
			height: 36px;
			border-radius: 20PX;
			background: cornflowerblue;
			color: white;
			text-align: center;
			line-height: 36px;
			margin: 0 auto;
			&:active {
				background: #5f87da;
			}
		}
	}
	.loading-container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		/deep/ .van-loading__spinner {
			width: 50px;
			height: 50px;
		}
	}
}
</style>
