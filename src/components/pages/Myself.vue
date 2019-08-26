<template>
  <div id="myself">
		<div class="background">
		  <img :src="backgroundUrl" alt="none">
	  </div>
	  <my-header :title="title" class="my-title" ref="title"></my-header>
	  <div class="main-content" ref="main" @scroll="sticky">
		  <div class="top-myself" ref="top">
			  <div class="avatar">
				  <img :src="avatarUrl" alt="none">
			  </div>
			  <div class="user">
				  <div class="nickname">{{nickname}}</div>
				  <div class="follow">关注 {{follows}} | 粉丝 {{followeds}}</div>
				  <div class="follow">{{signature}}</div>
			  </div>
		  </div>
		  <ul class="tabs">
			  <li @click="changeTab(0)" :class="[cur === 0 ? 'i-active' : '']">音乐</li>
			  <li @click="changeTab(1)" :class="[cur === 1 ? 'i-active' : '']">动态</li>
		  </ul>
		  <swiper ref="mySwiper" class="container" :options="SOptions">
			  <swiper-slide v-show="showOne">
				  <router-view name="music" @showOne="showOnes"></router-view>
			  </swiper-slide>
			  <swiper-slide>
				  <router-view name="share"></router-view>
			  </swiper-slide>
		  </swiper>
	  </div>
  </div>
</template>

<script>
	var _this = {}
	import BScroll from "better-scroll"
	import {mapState} from 'vuex'
	import MyHeader from "../component/MyHeader";
  export default {
		name: 'Myself',
    components: {MyHeader},
    data() {
		  return {
		    showOne: false,
		    swiper: {},
		    topArr: [],
		    outSide: 0,
		    SOptions: {
		      autoHeight: true,
			    on: {
					  slideChangeTransitionEnd() {
					    console.log(this.activeIndex)
						  _this.cur = this.activeIndex
						  if (this.activeIndex === 0 && _this.outSide >= _this.$refs.top.clientHeight) {
						    _this.topArr[1] = _this.$refs.main.scrollTop
						    _this.$refs.main.scrollTo({
								  top: _this.topArr[0],
								  behavior: 'smooth'
							  })
						  } else if (this.activeIndex === 1 && _this.outSide >= _this.$refs.top.clientHeight) {
						    _this.topArr[0] = _this.$refs.main.scrollTop
						    _this.$refs.main.scrollTo({
								  top: _this.topArr[1],
								  behavior: 'smooth'
							  })
						  }
					  }
					}
		    },
		    cur: 0,
		    backgroundUrl: '',
        title: '',
        avatarUrl: '',
        nickname: '',
        follows: '',
        followeds: '',
	      signature: ''
      }
		},
	  computed: {
      ...mapState({
			  uid: 'uid'
		  })
	  },
	  created() {
		  _this = this
      this.getAllData()
	  },
	  mounted() {
		  this.topArr.push(this.$refs.top.clientHeight)
		  this.topArr.push(this.$refs.top.clientHeight)
		  console.log(this.topArr)
		  setTimeout(this.initSwiper, 30)
	  },
	  watch: {
		  outSide(newV) {
				console.log(newV)
		  }
	  },
		methods: {
		  showOnes() {
		    this.showOne = true
		  },
		  initSwiper() {
		    this.swiper = this.$refs.mySwiper.swiper
		  },
		  changeTab(index) {
		    this.cur = index
			  this.swiper.slideTo(index,500,false)
		  },
		  kikil() {
		    console.log(this.$refs.kikil.scrollTop)
		  },
		  _offset(offsetWidth) {
        this.$refs.insideWrp.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
      },
		  sticky() {
		    var scrollTop = this.$refs.main.scrollTop
			  this.outSide = scrollTop
		    if (scrollTop >= this.$refs.top.clientHeight) {
		      this.title = this.nickname
		    } else {
		      this.title = ''
		    }
		  },
			getAllData() {
        let user = `/api/user/detail?uid=${this.uid}`
        let userSocial = `/api/user/event?uid=${this.uid}`
        this.axios.post(user).then(res => {
          console.log(res)
	        let { profile } = res.data
	        this.backgroundUrl = profile.backgroundUrl
	        this.avatarUrl = profile.avatarUrl
	        this.nickname = profile.nickname
	        this.follows = profile.follows
	        this.followeds = profile.followeds
	        this.signature = profile.signature
        }).catch(err => {
          console.log(err)
        })
		    this.axios.post(userSocial).then(res => {
		      console.log(res)
		    }).catch(err => {
		      console.log(err)
		    })
	    }
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#myself {
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 60px;
	z-index: 6;
	.background {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.my-title {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 5;
	}
	.main-content {
		width: 100%;
		position: fixed;
		top: 50px;
		left: 0;
		right: 0;
		bottom: 60px;
		overflow: scroll;
		.top-myself {
			width: 100%;
			padding: 50px 15px 15px;
			.avatar {
				width: 100px;
				height: 100px;
				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.user {
				margin-top: 16px;
				.nickname {
					color: white;
					font-size: 18px;
					font-weight: bolder;
				}
				.follow {
					margin-top: 8px;
					color: white;
					font-size: 14px;
				}
			}
		}
		.tabs {
			z-index: 7;
			position: -webkit-sticky;
			position: sticky;
			top: 0;
			background: #e8e8e8;
			border-radius: 25px 25px 0 0;
			width: 100%;
			height: 50px;
			display: flex;
			justify-content: space-around;
			font-size: 0;
			.i-active {
				color: red;
				font-weight: bolder;
			}
			li {
				font-size: 16px;
				display: inline-block;
				text-align: center;
				flex: 1;
				height: 50px;
				line-height: 50px;
			}
		}
		.container {
			background: white;
		}
	}
}
</style>
