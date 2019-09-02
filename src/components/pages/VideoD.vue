<template>
  <div id="video-d" v-if="show">
	  <my-header :title="data.name" class="my-header"></my-header>
	  <video class="video-look" controls="controls" :src="data.brs[480]" width="500px" height="500px" loop autoplay
		         :poster="data.cover"></video>
	  <div class="main">
		  <div class="title">
			  <div class="name">
				  {{data.name}}
			  </div>
			  <div class="play-count">
				  {{data.playCount | normalizeNum}}次观看
			  </div>
			  <div class="publish">
				  {{data.publishTime}} 发布
			  </div>
		  </div>
		  <div class="choices">
			  <div class="choice">
				  <div class="icon">
					  <i class="iconfont icon-zan"></i>
				  </div>
				  {{data.likeCount}}
			  </div>
			  <div class="choice">
				  <div class="icon">
					  <i class="iconfont icon-xihuan-kongpt"></i>
				  </div>
					{{data.subCount}}
			  </div>
			  <div class="choice">
				  <div class="icon">
					  <i class="iconfont icon-pinglunpt1"></i>
				  </div>
					{{data.commentCount}}
			  </div>
			  <div class="choice">
				  <div class="icon">
					  <i class="iconfont icon-fenxiangpt"></i>
				  </div>
					{{data.shareCount}}
			  </div>
		  </div>
		  <div class="singer">
				{{data.artistName}}
		  </div>
		  <div class="video-a">
			  <div class="section">
				  相关视频
			  </div>
			  <ul>
				  <li v-for="(item, i) in relate" :key="i">
						<div class="image">
							<div class="listen">
								<i class="iconfont icon-play"></i>
								<span>{{item.playTime | normalizeNum}}</span>
							</div>
							<img :src="item.coverUrl" alt="none">
						</div>
					  <div class="content">
						  <div class="main-title">{{item.title}}</div>
						  <div class="detail">
							  {{format(item.durationms/1000)}} by {{item.creator[0].userName}}
						  </div>
					  </div>
				  </li>
			  </ul>
		  </div>
		  <div class="video-com">
			  <div class="section">
				  最新评论
			  </div>
			  <ul>
				  <li v-for="(com , i) in comment" :key="i+13">
						<div class="nick">
							<div class="avatar">
								<img :src="com.user.avatarUrl" alt="none">
							</div>
							<div class="nickname">
								{{com.user.nickname}}
								<div class="post-time">{{com.time | formatDate}}</div>
							</div>
							<div class="icon">
								<i class="iconfont icon-zan"></i>
							</div>
						</div>
					  <div class="content">
						  {{com.content}}
					  </div>
				  </li>
			  </ul>
		  </div>
	  </div>
  </div>
</template>

<script>
	import { formatTimeToStr } from '../../assets/js/time'
	import MyHeader from "../component/MyHeader";
  export default {
		name: 'VideoD',
    components: {MyHeader},
    data() {
		  return {
		    show: false,
				data: {},
			  relate: [],
			  comment: [],
			  scrollTop: 0
		  }
		},
		created() {
		  this.getAllData()
		},
		beforeRouteEnter(to, from, next) {
		  console.log(from)
		  next(vm => {
		    vm.getAllData()
		  })
	  },
	  filters: {
		  formatDate: function(time) {
        if(time!==null && time!=="") {
          var date = new Date(time);
          return formatTimeToStr(date, "yyyy.MM.dd hh:mm");
        } else{
          return "";
        }
      },
		  normalizeNum (val) {
		    var num = parseInt(val)
		    if (num > 99999999) {
		      num = num / 100000000
					return parseInt(num) + '亿'
		    } else if (num > 99999) {
          num = num / 10000
          return parseInt(num) + '万'
        } else {
          return parseInt(num)
        }
      },
		},
		methods: {
		  format(interval) {
        interval = interval | 0
        var minute = interval / 60 | 0
			  minute = this._pad(minute)
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
		  _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
		  getAllData() {
		    let url = `/api/mv/detail?mvid=${this.$route.query.id}`
		    let url1 = `/api/related/allvideo?id=${this.$route.query.id}`
		    let url2 = `/api/comment/mv?id=${this.$route.query.id}`
		    this.axios.post(url).then(res => {
		      console.log(res)
			    let { data } = res.data
			    this.data = data
			    this.show = true
		    })
		    this.axios.post(url1).then(res => {
		      console.log(res)
			    let { data } = res.data
			    this.relate = data
		    })
		    this.axios.post(url2).then(res => {
		      console.log(res)
			    let { comments } = res.data
			    this.comment = comments
		    })
		  }
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#video-d {
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	bottom: 60px;
	background: white;
	.my-header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 4;
	}
	.video-look {
		margin-top: 50px;
		width: 100%;
		height: 210px;
		object-fit: fill;
	}
	.main {
		width: 100%;
		position: fixed;
		top: 260px;
		bottom: 60px;
		left: 0;
		overflow: scroll;
		.title {
			width: 100%;
			padding: 10px;
			.name {
				width: 100%;
				font-size: 20px;
				font-weight: bolder;
				margin-bottom: 20px;
			}
			.play-count {
				width: 100%;
				font-size: 16px;
				margin-bottom: 15px;
			}
			.publish {
				width: 100%;
				font-size: 16px;
				margin-bottom: 15px;
			}
		}
		.choices {
			border-bottom: 1PX solid rgba(127,127,127,0.2);
			text-align: center;
			width: 100%;
			padding: 10px 0;
			display: flex;
			font-size: 0;
			justify-content: space-around;
			.choice {
				display: inline-block;
				font-size: 16px;
				.icon {
					width: 100%;
					margin-bottom: 5px;
					i {
						font-size: 26px;
					}
				}
			}
		}
		.singer {
			width: 100%;
			height: 40px;
			line-height: 40px;
			font-size: 16px;
			padding-left: 10px;
			border-bottom: 5PX solid rgba(127,127,127,0.2);
		}
		.video-a {
			width: 100%;
			display: table;
			.section {
				width: 100%;
				padding-left: 10px;
				font-size: 16px;
				height: 40px;
				line-height: 40px;
			}
			ul {
				width: 100%;
				li {
					margin-bottom: 10px;
					padding-left: 10px;
					width: 100%;
					height: 80px;
					display: table;
					.image {
						height: 80px;
						position: relative;
						display: inline-block;
						.listen {
							height: 20px;
							line-height: 20px;
							position: absolute;
							top: 0;
							right: 5px;
							font-size: 12px;
							color: white;
							i {
								font-size: 12px;
							}
						}
						img {
							border-radius: 8PX;
							line-height: 0;
							width: 130px;
							height: 100%;
						}
					}
					.content {
						text-align: left;
						display: table-cell;
						vertical-align: middle;
						width: 235px;
						padding: 0 10px;
						.main-title {
							font-size: 14px;
							line-height: 1.2;
						}
						.detail {
							color: #7e8c8d;
							margin-top: 5px;
						}
					}
				}
			}
		}
		.video-com {
			width: 100%;
			.section {
				width: 100%;
				padding-left: 10px;
				font-size: 16px;
				height: 28px;
				line-height: 28px;
			}
			ul {
				width: 100%;
				li {
					width: 100%;
					padding: 15px 10px;
					border-bottom: 1PX solid rgba(127,127,127,0.2);
					.nick {
						width: 100%;
						height: 38px;
						font-size: 0;
						.avatar {
							line-height: 0;
							display: inline-block;
							width: 38px;
							height: 38px;
							img {
								width: 100%;
								border-radius: 50%;
								height: 100%;
							}
						}
						.nickname {
							padding: 5px 0 0 15px;
							vertical-align: top;
							font-size: 14px;
							display: inline-block;
							width: 200px;
							height: 100%;
							.post-time {
								margin-top: 5px;
								font-size: 12px;
								color: #7e8c8d;
							}
						}
						.icon {
							float: right;
							vertical-align: top;
							display: inline-block;
							height: 100%;
							line-height: 38px;
							i {
								font-size: 20px;
							}
						}
					}
					.content {
						padding-top: 10px;
						width: 302px;
						margin-left: 53px;
						line-height: 1.3;
					}
				}
			}
		}
	}
}
</style>
