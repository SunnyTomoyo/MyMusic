<template>
  <div class="player" v-show="playlist.length > 0">
		<transition name="mini">
			<div class="mini-player" @click="showBig" v-show="!bigVisual">
				<div class="album-img">
					<img :src="playingSong.image" alt="none">
				</div>
				<div class="content">
					<div class="song-name">{{playingSong.name}}</div>
					<div class="song-singer">{{playingSong.singer}}</div>
				</div>
				<div class="control" @click.stop="togglePlaying()">
					<i class="iconfont" :class="playingIcon[playing]"></i>
				</div>
				<div class="control" @click.stop="showPlayList">
					<i class="iconfont icon-bofangliebiao"></i>
				</div>
			</div>
    </transition>
	  <transition name="normal">
		  <div class="normal-player" v-show="bigVisual">
				<div class="header">
					<i class="iconfont icon-fanhui" @click.stop="back"></i>
					<div class="title">
						<div class="name">{{playingSong.name}}</div>
						<div class="singer">{{playingSong.singer}}</div>
					</div>
				</div>
				<div class="middle">
					<div class="avatar" :class="cdCls">
						<img :src="playingSong.image" alt="none">
					</div>
				</div>
			  <div class="control">
				  <div class="progress-wrapper">
            <div class="time time-l">{{format(currentTime)}}</div>
            <div class="progress-bar-wrapper" ref="progressBar">
	            <div class="bar-inner" @click.stop="progressClick" ref="bar">
								<div class="progress" ref="progress"></div>
					      <div class="progress-btn-wrapper" ref="progressBtn"
					           @touchstart.prevent="progressTouchStart"
					           @touchmove.prevent="progressTouchMove"
					           @touchend="progressTouchEnd">

					        <div class="progress-btn"></div>
					      </div>
	            </div>
            </div>
            <div class="time time-r">{{format(songDuration)}}</div>
          </div>
					<div class="icons">
						<div class="icon" @click.stop="setMode">
							<i class="iconfont" :class="modeIcon[modeNum]"></i>
						</div>
						<div class="icon" @click.stop="prev">
							<i class="iconfont icon-shangyiqu"></i>
						</div>
						<div class="icon" @click.stop="togglePlaying()" >
							<i style="font-size: 52px" class="aa iconfont" :class="playingIcon[playing]"></i>
						</div>
						<div class="icon" @click.stop="next">
							<i class="iconfont icon-xiayiqu"></i>
						</div>
						<div class="icon" @click.stop="showPlayList">
							<i class="iconfont icon-bofangliebiao"></i>
						</div>
					</div>
			  </div>
		  </div>
	  </transition>
	  <div class="playing-list" v-if="showPList">
			<div class="mask" @click.stop="hidePlayList"></div>
			<div class="lists">
				<div class="mode" @click.stop="setMode">
					<div class="icon">
						<i class="iconfont" :class="modeIcon[modeNum]"></i>
					</div>
					<div class="list">
						{{mode[modeNum]}} ({{playlist.length}})
					</div>
				</div>
				<div class="lists-song">
					<div :key="i" v-for="(item, i) in playlist" class="item" @click="singANewSong(i)">
						<div class="name">
							<div class="icon" v-show="playingSong.id === item.id">
								<i class="iconfont icon-shengyin"></i>
							</div>
							{{item.name}} - <span>{{item.singer}}</span>
						</div>
						<div class="icon">
							<i class="iconfont icon-jiaocha"></i>
						</div>
					</div>
				</div>
			</div>
	  </div>
	  <audio ref="audio" :src="songUrl" @play="ready" autoplay="true" @timeupdate="updateTime"
	   @ended="end">
		  Your browser does not support the audio tag.
	  </audio>
  </div>
</template>

<script>
	import { randomNum } from "../../assets/js/random"
	import { mapState,mapMutations } from 'vuex'
  import Scroll from "./scroll";
	export default {
		name: 'player',
    components: {Scroll},
    data() {
		  return {
		    getLNum: 0,
		    scrollHeight: 0,
		    stop: 1,
		    offsetW: 0,
		    multiple: 0,
		    songDuration: 0,
		    currentTime: 0,
		    songReady: false,
		    playing: 0,
			  playingIcon: ['icon-bofang', 'icon-zanting'],
		    bigVisual: false,
		    mode: ['列表循环', '随机播放', '单曲循环'],
		    modeIcon: ['icon-xunhuanbofang', 'icon-suijibofang', 'icon-danquxunhuan1'],
		    showPList: false
		  }
		},
		created() {
      this.touch = {}
    },
		mounted() {
		  setTimeout(() => {
		    this.offsetW = this.$refs.bar.clientWidth
		  }, 30)
		},
		computed: {
		  cdCls() {
        return this.playing === 0 ? 'play' : 'play pause'
      },
		  ...mapState({
			  modeNum: 'modeNum',
			  currentIndex: 'currentIndex',
			  uid: 'uid',
			  playlist: 'playlist',
			  playingSong: 'playingSong',
			  songUrl: 'songUrl'
		  })
		},
		watch: {
			currentTime(cur) {
			  if (this.stop) {
			    this.multiple = parseInt(cur) / this.songDuration
					this.multiple = this.multiple.toFixed(2)
					this._offset(this.offsetW * this.multiple)
			  }
			}
		},
		methods: {
		  ...mapMutations({
			  setPlaylist: 'SET_PLAYLIST',
			  setSong: 'SET_PLAYINGSONG',
			  setIndex: 'SET_CURRENTINDEX',
			  setSongUrl: 'SET_SONGURL',
			  setMode: 'SET_MODE'
		  }),
			singANewSong(i) {
				let { id } = this.playlist[i]
				var url = `/api/song/url?id=${id}`
				  this.axios.post(url).then(res => {
				    console.log(res)
					  let {data} = res.data
					  if (data[0].url === null) {
					    this.$dialog.alert({
							  message: '该资源暂不存在'
							})
						  var arr = new Array()
						  var str = ''
						  var obj = {}
						  this.showPList = false
						  this.setPlaylist(arr)
						  this.setIndex(-1)
				      this.setSong(obj)
					    this.setSongUrl(str)
					  } else {
					    this.setIndex(i)
						  this.setSong(this.playlist[i])
					    this.setSongUrl(data[0].url)
						  this.playing = 0
						  this.songReady = false
					  }
				  }).catch(err => {
				    console.log(err)
				  })
			},
			progressTouchEnd(e) {
				this.touch.initiated = false
				this.multiple = this.touch.offsetWidth / this.$refs.bar.clientWidth
				this.multiple = this.multiple.toFixed(2)
				this.$refs.audio.currentTime = this.songDuration * this.multiple
				this.stop = 1
			},
			progressClick(e) {
		    let rect = this.$refs.progress.getBoundingClientRect()
				let offsetWidth = e.pageX - rect.left
				if (offsetWidth > this.$refs.bar.clientWidth) {
				  offsetWidth = this.$refs.bar.clientWidth
					this.multiple = 1
				} else if (offsetWidth < 0) {
				  offsetWidth = 0
					this.multiple = 0
				}
				this.multiple = offsetWidth/this.$refs.bar.clientWidth
				this.multiple = this.multiple.toFixed(2)
				this.$refs.audio.currentTime = this.songDuration * this.multiple
				this._offset(offsetWidth)
			},
			end() {
        if (this.modeNum === 2) {
          this.loop()
        } else {
          this.next()
        }
      },
			randomPlay() {
		    let num = randomNum(0, this.playlist.length - 1)
				this.singANewSong(num)
			},
			loop() {
				this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.playing = 0
			},
			prev() {
		    this.getLNum = 0
				if (!this.songReady) {
          return
        }
				if (this.modeNum === 0) {
				  console.log(this.currentIndex)
					if (this.currentIndex === 0) {
					  this.singANewSong(this.playlist.length-1)
					} else {
					  this.singANewSong(this.currentIndex-1)
					}
				} else if (this.modeNum === 1) {
					this.randomPlay()
				} else {
				  this.loop()
				}
			},
		  next() {
		    this.getLNum = 0
				if(this.modeNum === 0) {
				  console.log(this.currentIndex)
					if (this.currentIndex === this.playlist.length-1) {
					  this.singANewSong(0)
					} else {
					  this.singANewSong(this.currentIndex+1)
					}
				} else if (this.modeNum === 1) {
					this.randomPlay()
				} else {
				  this.loop()
				}
		  },
		  _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
      },
		  progressTouchMove(e) {
		    this.stop = 0
        if (!this.touch.initiated) {
          return
        }
        // 手指移动横坐标距离
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth, Math.max(0, this.touch.left + deltaX))
			  this.touch.offsetWidth = offsetWidth
        this._offset(offsetWidth)
      },
		  progressTouchStart(e) {
		    console.log(this.touch)
			  this.stop = 0
		    this.touch.initiated = true
			  // 手指点到屏幕的横坐标
        this.touch.startX = e.touches[0].pageX
				// 进度条active长度
        this.touch.left = this.$refs.progress.clientWidth
      },
		  updateTime(e) {
        this.currentTime = e.target.currentTime
      },
		  format(interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
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
		  togglePlaying() {
        if (!this.songReady) {
          alert('该浏览器不支持audio')
          return
        }
        if (this.$refs.audio.paused) {
          this.$refs.audio.play()
	        this.playing = 0
        } else {
          this.playing = 1
	        this.$refs.audio.pause()
        }
      },
		  ready() {
				this.songReady = true
			  this.playing = 0
			  this.songDuration = this.$refs.audio.duration
		  },
		  showBig() {
		    this.bigVisual = true
			  setTimeout(() => {
			    this.offsetW = this.$refs.bar.clientWidth
			  }, 30)
		  },
			back() {
		    this.bigVisual = false
		  },
		  showPlayList() {
				this.showPList = true
		  },
			hidePlayList() {
		    this.showPList = false
			}
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.player {
	.normal-player {
		background: #90b1bf;
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 300;
		.header {
			z-index: 300;
			display: table-row;
			width: 100%;
			height: 52px;
			font-size: 0;
			i {
				color: white;
				display: inline-block;
				width: 52px;
				height: 52px;
				line-height: 52px;
				font-size: 20px;
				text-align: center;
			}
			.title {
				z-index: 300;
				vertical-align: middle;
				display: table-cell;
				.name {
					color: white;
					font-size: 18px;
					font-weight: bolder;
				}
				.singer {
					font-size: 12px;
					color: grey;
					margin-top: 5px;
				}
			}
		}
		.middle {
			z-index: 300;
			width: 100%;
			height: 410px;
			position: fixed;
			top: 50px;
			left: 0;
			.avatar {
				border-radius: 50%;
				border: 10px solid rgba(255, 255, 255, 0.1);
				position: absolute;
				top: 92.5px;
				left: 75px;
				display: inline-block;
				width: 60%;
				height: 225px;
				/*border-radius: 50%;*/
				@keyframes rotate {
					0% {
						transform: rotate(0);
					}
			    100% {
				    transform: rotate(360deg);
			    }
				}
				&.play {
					-webkit-animation: rotate 20s linear infinite;
				}
				&.pause {
					-webkit-animation-play-state: paused;
				}
				img {
					border-radius: 50%;
					width: 100%;
					height: 100%;
				}
			}
			.lyric-all {
				font-size: 14px;
				overflow: hidden;
				width: 100%;
				height: 410px;
				.lyric-wrapper {
					margin: 0 auto;
					text-align: center;
					width: 85%;
					.text{
						line-height: 1.2;
						&.current {
							color: white;
						}
					}
				}
			}
		}
		.control {
			z-index: 300;
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			.progress-wrapper {
				width: 100%;
				height: 30px;
				padding: 0 15px;
				font-size: 0;
				.progress-bar-wrapper {
					width: 277px;
					vertical-align: top;
					display: inline-block;
					height: 30px;
					margin: 0 10px;
					.bar-inner {
						width: 247px;
						left: 15px;
						position: relative;
			      top: 13px;
			      height: 4px;
			      background: rgba(0, 0, 0, 0.3);
						.progress {
							position: absolute;
			        height: 100%;
			        background: white;
						}
						.progress-btn-wrapper {
							position: absolute;
			        left: -15px;
			        top: -13px;
			        width: 30px;
			        height: 30px;
							.progress-btn {
								position: relative;
			          top: 7px;
			          left: 7px;
			          box-sizing: border-box;
			          width: 16px;
			          height: 16px;
			          border: 3px solid white;
			          border-radius: 50%;
			          background: yellow;
							}
						}
					}
				}
				.time {
					vertical-align: top;
					display: inline-block;
					height: 30px;
					font-size: 12px;
					line-height: 30px;
				}
			}
			.icons{
				z-index: 300;
				width: 100%;
				display: flex;
				padding: 12px 36px 42px;
				align-items: center;
				justify-content: space-between;
				.icon {
					i {
						font-size: 26px;
						color: white;
					}
				}
			}
		}
	}
	.mini-player {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 180;
		width: 100%;
		height: 60px;
		background: lightblue;
		font-size: 0;
		display: table-row;
		.album-img {
			line-height: 0;
			display: table-cell;
			padding: 6px;
			width: 60px;
			height: 60px;
			img {
				border-radius: 50%;
				width: 48px;
				height: 48px;
			}
		}
		.content {
			overflow: hidden;
			display: table-cell;
			padding-left: 10px;
			height: 60px;
			width: 219px;
			vertical-align: middle;
			.song-name {
				font-size: 16px;
			}
			.song-singer {
				margin-top: 10px;
				color: grey;
				font-size: 12px;
			}
		}
		.control {
			vertical-align: middle;
			display: table-cell;
			height: 60px;
			width: 48px;
			i {
				display: block;
				font-size: 32px;
				line-height: 48px;
				text-align: center;
				width: 48px;
				height: 48px;
			}
		}
	}
	.playing-list {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 380;
		.mask {
			background: rgba(0,0,0,0.3);
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 380;
		}
		.lists {
			border-radius: 20px 20px 0 0;
			z-index: 380;
			width: 100%;
			height: 406px;
			position: fixed;
			left: 0;
			bottom: 0;
			right: 0;
			background: azure;
			padding: 15px 10px;
			.mode {
				border-bottom: 1PX solid grey;
				width: 100%;
				height: 40px;
				font-size: 0;
				.icon {
					line-height: 40px;
					height: 100%;
					display: inline-block;
					i {
						font-size: 22px;
					}
				}
				.list {
					vertical-align: top;
					line-height: 40px;
					height: 100%;
					font-size: 16px;
					display: inline-block;
				}
			}
			.lists-song {
				width: 100%;
				height: 350px;
				padding: 15px 0;
				overflow: scroll;
				.item {
					font-size: 0;
					width: 100%;
					padding: 15px 0;
					.name {
						white-space: nowrap;
						text-overflow: ellipsis;
						display: inline-block;
						overflow: hidden;
						width: 88%;
						font-size: 16px;
						.icon {
							text-align: center;
							vertical-align: top;
							height: 100%;
							width: 6%;
							display: inline-block;
							i {
								font-size: 16px;
							}
						}
						span {
							color: grey;
							font-size: 12px;
						}
					}
					.icon {
						text-align: center;
						vertical-align: top;
						height: 100%;
						width: 12%;
						display: inline-block;
						i {
							font-size: 16px;
						}
					}
				}
			}
		}
	}
}
</style>
