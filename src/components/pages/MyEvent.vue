<template>
  <div id="my-event">
		<div class="events" v-for="(item, i) in events" :key="i">
			<div class="myself">
				<div class="avatar">
					<img :src="item.user.avatarUrl" alt="none">
				</div>
				<div class="name">
					<div class="nick">{{item.user.nickname}}</div>
					<div class="time">{{item.eventTime | formatDate}}</div>
				</div>
			</div>
			<div class="my-text" v-if="myselfText(item.json)">
				{{item.json | myText}}
			</div>
			<div v-show="checkContentType(item.json) !== ''">
				<div class="big-content" v-if="checkContentType(item.json) === 'event'">
					<div class="share">
						@{{item.json | nickname}} 分享单曲： <span v-html="mainText[i]"></span>
						<div class="images" v-if="imageArr[i] !== ''">
							<img :src="item.squareUrl" alt="none" v-for="(item, index) in imageArr[i]" :key="index">
						</div>
					</div>
				</div>
				<div class="one-song" v-else-if="checkContentType(item.json) === 'song'">
					<div class="image">
						<img :src="item.json | alImg" alt="none">
					</div>
					<div class="text">
						<div class="name">{{item.json | songName}}</div>
						<div class="singer">{{item.json | singer}}</div>
					</div>
				</div>
				<div class="song-playlist" v-else-if="checkContentType(item.json) === 'playlist'">
					<div class="image">
						<img :src="item.json | plImg" alt="none">
					</div>
					<div class="text">
						<div class="name">{{item.json | plName}}</div>
						<div class="singer">by {{item.json | crName}}</div>
					</div>
				</div>
			</div>
			<div class="footer">
				<div class="item" v-for="(item, index) in iconArr" :key="index">
					<div class="icon">
						<i class="iconfont" :class="item.icon"></i>
					</div>
					<div class="text">
						{{item.text}}
					</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
	import {formatTimeToStr} from '../../assets/js/time';
	import {mapState} from 'vuex'
	export default {
		name: 'MyEvent',
		data() {
		  return {
		    mainText: [],
		    imageArr: [],
		    myTexts: true,
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
		    events: []
		  }
		},
		created() {
		  this.getAllData()
		},
		computed: {
      ...mapState({
        uid: 'uid'
      })
    },
		filters: {
		  formatDate: function(time) {
        if(time!==null && time!=="") {
          var date = new Date(time);
          return formatTimeToStr(date, "yyyy年MM月dd日");
        } else{
          return "";
        }
      },
			myText(text) {
		    var message = JSON.parse(text)
				var { msg } = message
				return msg
			},
			nickname(text) {
		    var message = JSON.parse(text)
				var { event: {user: {nickname} } } = message
				var { event: { json }  } = message
				console.log(json)
				console.log(JSON.parse(json))
				console.log(nickname)
				console.log(event)
				return nickname
			},
			alImg(json) {
		    var message = JSON.parse(json)
				var { song } = message
				return song.album.img80x80
			},
			plImg(json) {
		    var message = JSON.parse(json)
				var { playlist } = message
				return playlist.img80x80
			},
			songName(json) {
		    var message = JSON.parse(json)
				var { song } = message
				return song.name
			},
			plName(json) {
		    var message = JSON.parse(json)
				var { playlist } = message
				return playlist.name
			},
			crName(json) {
		    var message = JSON.parse(json)
				var { playlist } = message
				return playlist.creator.nickname
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
				console.log(singer)
				return singer
			}
		},
		methods: {
		  eMsg(text) {
		      var re = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
					text = text.replace(re, '<a href="$1$2">网页链接</a>')
					this.mainText.push(text)
			},
		  checkContentType(text) {
		    var message = JSON.parse(text)
				if (message.hasOwnProperty('event')) {
				  return 'event'
				} else if (message.hasOwnProperty('playlist')) {
					return 'playlist'
				} else if (message.hasOwnProperty('song')) {
					return 'song'
				} else {
				  return ''
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
		  mainContent(text) {
        var message = JSON.parse(text)
				var num = Object.getOwnPropertyNames(message).length
				return num
			},
		  getAllData() {
		    let url = `/api/user/event?uid=${this.uid}`
		    this.axios.post(url).then(res => {
		      console.log(res)
			    let {events} = res.data
			    this.events = events
			    this.events.forEach(item => {
			      var message = JSON.parse(item.json)
				    if(message.hasOwnProperty('event')) {
				      let { event: {pics, json} } = message
					    let { msg } = JSON.parse(json)
					    if(pics.length === 0) {
					      this.imageArr.push('')
					    } else {
					      this.imageArr.push(pics)
					    }
					    if (msg === '') {
					      this.mainText.push('')
					    } else {
					      this.eMsg(msg)
					    }
				    } else {
				      this.imageArr.push('')
				      this.mainText.push('')
				    }
			    })
			    console.log(JSON.parse(events[2].json).event)
			    console.log(JSON.parse(events[4].json))
			    console.log(JSON.parse(events[7].json))
		    })
		  }
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#my-event {
	width: 375px;
	.events {
		position: relative;
		border-bottom: 1PX solid #bdbdbd;
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
		}
		.big-content {
			font-size: 15px;
			line-height: 1.4;
			width: 295px;
			margin-left: 50px;
			border-radius: 5px;
			background: #e2e2e2;
			padding: 5px 10px 5px 5px;
			.share {
				.images {
					margin-top: 8px;
					width: 295px;
					img {
						border-radius: 5PX;
						margin-right: 3%;
						line-height: 0;
						width: 30%;
						height: 88.5px;
					}
				}
			}
		}
		.one-song {
			border-radius: 5PX;
			margin-left: 50px;
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
					white-space: nowrap;
					text-overflow: ellipsis;
					height: 50%;
					line-height: 19px;
					font-size: 16px;
				}
				.singer {
					white-space: nowrap;
					text-overflow: ellipsis;
					color: #819a9b;
					line-height: 19px;
					height: 50%;
				}
			}
		}
		.song-playlist {
			border-radius: 5PX;
			margin-left: 50px;
			width: 295px;
			height: 52px;
			background: #e2e2e2;
			padding: 5px;
			.image {
				vertical-align: top;
				width: 42px;
				height: 42px;
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
				width: 230px;
				overflow: hidden;
				.name {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					height: 50%;
					line-height: 22px;
					font-size: 16px;
				}
				.singer {
					white-space: nowrap;
					text-overflow: ellipsis;
					color: #819a9b;
					line-height: 22px;
					height: 50%;
				}
			}
		}
		.footer {
			/*position: absolute;*/
			/*left: 0;*/
			/*bottom: 0;*/
			width: 100%;
			height: 32px;
			padding-left: 50px;
			.item {
				display: inline-block;
				font-size: 0;
				margin-right: 52px;
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
