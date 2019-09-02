<template>
  <div id="friend">
	  <div class="events" v-for="(item, i) in shares" :key="i">
			<div class="myself">
				<div class="avatar">
					<img :src="item.user.avatarUrl" alt="none">
				</div>
				<div class="name">
					<div class="nick">{{item.user.nickname}}</div>
					<div class="time">{{item.eventTime | formatDate}}</div>
				</div>
			</div>
		  <div class="my-text" v-if="myselfText(item.json)" v-html="myText(item.json)">
			</div>
		  <div class="my-videos" v-if="checkType(item.json, 'video')">
			  <video v-if="videoUrl[i]" class="video-look" controls="controls" :src="videoUrl[i]" loop
		         :poster="getMyV(item.json, 'coverUrl')"></video>
		  </div>
		  <div class="my-images" v-if="checkImg(item)">
			  <img :src="it.squareUrl" alt="none" v-for="(it, index) in item.pics" :key="index+8">
		  </div>
		  <div class="my-song" v-if="checkType(item.json, 'song')">
			  <div class="image">
					<img :src="item.json | alImg" alt="none">
				</div>
				<div class="text">
					<div class="name">{{item.json | songName}}</div>
					<div class="singer">{{item.json | singer}}</div>
				</div>
		  </div>
		  <div class="footer">
				<div class="item">
					<div class="icon">
						<i class="iconfont icon-forward"></i>
					</div>
					<div class="text">
						{{item.info | sharesNum(0)}}
					</div>
				</div>
				<div class="item">
					<div class="icon">
						<i class="iconfont icon-pinglunpt1"></i>
					</div>
					<div class="text">
						{{item.info | sharesNum(1)}}
					</div>
				</div>
				<div class="item">
					<div class="icon">
						<i class="iconfont icon-zan"></i>
					</div>
					<div class="text">
						{{item.info | sharesNum(2)}}
					</div>
				</div>
			</div>
	  </div>
  </div>
</template>

<script>
	import {formatTimeToStr} from '../../assets/js/time';
	import { mapState, mapMutations } from 'vuex'
	export default {
		name: 'Friend',
		data() {
		  return {
		    iconArr:[{
		      text: '转发',
			    icon: 'icon-forward'
		    },{
		      text: '评论',
			    icon: 'icon-pinglunpt1'
		    },{
		      text: '赞',
			    icon: 'icon-zan'
		    }],
		    shares: [],
			  videoUrl: [],
			  checkV: false
		  }
		},
		filters: {
		  sharesNum(content,index) {
		    if (index===0) {
		      return content.shareCount
		    } else if (index===1) {
		      return content.commentCount
		    } else {
		      return content.likedCount
		    }
		  },
		  sNickName(json) {
		    var message = JSON.parse(json)
			  var event = message.event
			  return event.user.nickname
		  },
		  singer(json) {
		    var message = JSON.parse(json)
				var { song } = message
				var singer = ''
				if (song.artists.length === 1) {
				  singer = song.artists[0].name
				} else {
				  var len = song.artists.length
				  song.artists.forEach((item, i) => {
				    if (i+1 !== len) {
				      singer = singer + item.name + '/'
				    } else {
				      singer = singer + item.name
				    }
					})
				}
				return singer
			},
			alImg(json) {
		    var message = JSON.parse(json)
				var { song } = message
				return song.album.img80x80
			},
			songName(json) {
		    var message = JSON.parse(json)
				var { song } = message
				return song.name
			},
		  formatDate: function(time) {
        if(time!==null && time!=="") {
          var date = new Date(time);
          return formatTimeToStr(date, "yyyy.MM.dd hh:mm");
        } else{
          return "";
        }
      },
		},
		created() {
		  this.getAllData()
		},
		computed: {
		  ...mapState({
			  lasttime: 'lastShare'
		  })
		},
		methods: {
		  ...mapMutations({
			  'setLast': 'SET_LASTSHARE'
		  }),
			myText(text) {
		    var message = JSON.parse(text)
				var { msg } = message
		    var re = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
				msg = msg.replace(/\n/g, '<br />')
				msg = msg.replace(re, '<a href="$1$2">网页链接</a>')
				return msg
			},
			getMyV(text, type) {
		    var vUrl = ''
		    var message = JSON.parse(text)
				var { video } = message
				var url1 = `/api/video/url?id=${video.videoId}`
				if(type === 'br') {
				  this.axios.post(url1).then(res => {
				    this.checkV = true
					  let { url } = res.data.urls[0]
					  console.log(url)
					  return url
				  })
				} else {
				  return video[type]
				}
			},
			checkType(text, type) {
		    var message = JSON.parse(text)
				if(message.hasOwnProperty(type)) {
				  return true
				} else {
				  return false
				}
			},
			checkImg(item) {
		    if(item.pics.length) {
		      return true
		    } else {
		      return false
		    }
			},
			myselfText(text) {
		    var message = JSON.parse(text)
				var { msg } = message
		    if (msg) {
		      return true
		    } else {
		      return false
		    }
		  },
			getAllData() {
		    let url = `/api/event?lasttime=${this.lasttime}`
				this.axios.post(url).then(res => {
				  console.log(res)
				  let { data } = res
					this.shares = data.event
					this.setLast(data.lasttime)
					let arr = new Array(this.shares.length)
					this.shares.forEach((item, index) => {
					  var it = JSON.parse(item.json)
						console.log(it)
					  if(it.hasOwnProperty('video')) {
					    var url1 = `/api/video/url?id=${it.video.videoId}`
					    this.axios.post(url1).then(res => {
					      console.log(res)
						    let { urls } = res.data
						    arr.splice(index,1,urls[0].url)
					    })
					  } else {
					    arr.splice(index,1,'')
					  }
					})
					console.log(arr)
					this.videoUrl = arr
				})
		  }
    }
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#friend {
	overflow-x: hidden;
	width: 100%;
	position: fixed;
	top: 50px;
	left: 0;
	bottom: 60px;
	overflow-y: scroll;
	background: lavenderblush;
	.events {
		border-bottom: 1PX solid rgba(127,127,127,0.25);
		width: 100%;
		padding: 15px;
		.myself {
			width: 100%;
			display: table-row;
			.avatar {
				vertical-align: middle;
				display: table-cell;
				line-height: 0;
				width: 42px;
				height: 42px;
				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.name {
				display: table-cell;
				vertical-align: middle;
				padding-left: 8px;
				.nick {
					margin-bottom: 4px;
					font-size: 16px;
					color: deepskyblue;
				}
				.time {
					font-size: 12px;
					color: #bdbdbd;
				}
			}
		}
		.my-text {
			width: 100%;
			padding: 5px 0 15px 50px;
			font-size: 16px;
			line-height: 1.3;
		}
		.my-videos {
			width: 100%;
			padding: 5px 0 15px 50px;
			height: 200px;
			border-radius: 5PX;
			.video-look {
				border-radius: 5PX;
				width: 100%;
				height: 100%;
				object-fit: fill;
			}
		}
		.my-song {
			border-radius: 5PX;
			margin-left: 50px;
			margin-bottom: 20px;
			width: 295px;
			height: 48px;
			background: #e2e2e2;
			padding: 5px;
			.image {
				vertical-align: top;
				width: 38px;
				height: 38px;
				line-height: 0;
				display: inline-block;
				img {
					width: 100%;
					height: 100%;
					border-radius: 2PX;
				}
			}
			.text {
				display: inline-block;
				height: 100%;
				.name {
					width: 240px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					height: 50%;
					line-height: 19px;
					font-size: 16px;
				}
				.singer {
					width: 240px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					color: #819a9b;
					line-height: 19px;
					height: 50%;
				}
			}
		}
		.my-images {
			width: 100%;
			padding: 5px 0 15px 50px;
			img {
				border-radius: 5PX;
				margin-right: 1%;
				line-height: 0;
				margin-bottom: 4PX;
				width: 32%;
				height: 88.5px;
			}
		}
		.footer {
			width: 100%;
			height: 32px;
			padding-left: 50px;
			.item {
				display: inline-block;
				font-size: 0;
				margin-right: 48px;
				.icon {
					padding-right: 4px;
					display: inline-block;
					height: 32px;
					line-height: 32px;
					i {
						font-size: 18px;
					}
				}
				.text {
					vertical-align: top;
					display: inline-block;
					height: 32px;
					line-height: 32px;
					font-size: 12px;
				}
			}
		}
	}
}
</style>
