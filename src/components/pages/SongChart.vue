<template>
  <div id="song-chart">
	  <div class="background">
		  <img :src="coverImgUrl" alt="none">
	  </div>
		<my-header :title="title" ref="myHead" class="my-header"></my-header>
	  <div class="big-content" ref="container">
		  <div class="top-part" ref="topPart">
			  <div class="top-avatar">
				  <div class="top-listen">
					  <i class="iconfont icon-play"></i>
					  {{normalizeNum(playCount)}}
				  </div>
				  <img :src="coverImgUrl" alt="none">
			  </div>
			  <div class="top-content">
				  <div class="title">{{name}}</div>
				  <div class="top-people">
					  <img :src="creator.avatarUrl" alt="none"/>
					  <div class="creator-name">
						  {{creator.nickname}}
						  <i class="iconfont icon-you"></i>
					  </div>
				  </div>
				  <div class="top-detail">
					  <div class="d-text">
						  <span v-clamp v-html="description"></span>
					  </div>
					  <i class="iconfont icon-you"></i>
				  </div>
			  </div>
		  </div>
		  <div class="choice" ref="choice">
			  <div class="item">
					<i class="iconfont icon-pinglun"></i>
					<div>评论</div>
				</div>
			  <div class="item">
					<i class="iconfont icon-fenxiang"></i>
					<div>分享</div>
				</div>
			  <div class="item">
					<i class="iconfont icon-xiazai"></i>
					<div>下载</div>
				</div>
			  <div class="item">
					<i class="iconfont icon-duoxuan"></i>
					<div>多选</div>
				</div>
		  </div>
		  <div class="top-play">
			  <div class="inner">
				  <i class="iconfont icon-play"></i>
				  <div class="text">播放全部(共{{songList.length}}首)</div>
			  </div>
		  </div>
		  <div class="all-song" v-show="songList.length > 0" ref="listWrapper">
				<song-list :song-list="songList" ref="playlist" :changeIndex="changeIndex"></song-list>
		  </div>
	  </div>
  </div>
</template>

<script>
	import MyHeader from "../component/MyHeader";
  import SongList from "../component/SongList";
  import {createSong} from '../../assets/js/song'
  import Message from "../component/Message";
  export default {
		name: 'SongChart',
    components: {Message, SongList, MyHeader},
	  data() {
		  return {
		    mess: false,
		    index: 0,
		    playlistHeight: 0,
		    container: null,
		    songList: [],
		    arr: [],
		    title: '歌单',
			  coverImgUrl: '',
			  description: '',
				name: '',
			  playCount: 0,
			  creator: {},
			  tracks: [],
		    tracksId: []
		  }
	  },
    created() {
	    this.getAllData()
		},
	  beforeRouteEnter(to, from, next) {
		  next(vm => {
		    vm.getAllData()
		  })
	  },
	  methods: {
		  changeIndex(i) {
		    this.index = i
			  this.mess = true
		  },
		  normalizeSongs(list) {
				let ret = []
        list.forEach((item) => {
          if (item.id) {
            ret.push(createSong(item))
          }
        })
			  console.log(ret)
        return ret
		  },
		  normalizeNum (val) {
        if (val > 99999) {
          var num = val / 10000
          return parseInt(num) + '万'
        } else {
          return val
        }
      },
		  getAllData() {
		    let url = `/api/playlist/detail?id=${this.$route.query.id}`
		    this.axios.post(url).then(res => {
		      console.log(res)
			    let { data: { playlist } } = res
				  this.coverImgUrl = playlist.coverImgUrl
				  this.name = playlist.name
			    if (playlist.description) {
				    this.description = playlist.description.substr(0, 100).replace(/\n/g, '<br />')
			    } else {
			      this.description = '编辑信息'
			    }
				  this.playCount = playlist.playCount
				  this.creator = playlist.creator
			    this.tracks = playlist.tracks
			    if (this.tracks.length) {
			      this.songList = this.normalizeSongs(this.tracks)
			    }
		    })
		  }
	  }
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#song-chart {
	overflow-x: hidden;
	box-sizing: border-box;
	position: absolute;
	top: 0;
	left: 0;
	bottom: 60px;
	right: 0;
	width: 100%;
	.background {
		position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(13px);
		img {
			width: 100%;
			height: 100%;
		}
	}
	.my-header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 4;
	}
	.big-content {
		width: 100%;
		position: relative;
		top: 50px;
		left: 0;
		.top-play {
			position: -webkit-sticky;
			position: sticky;
			top: 50px;
			left: 0;
			.inner {
				width: 100%;
				height: 42px;
				line-height: 42px;
				padding-left: 20px;
				border-radius: 20px 20px 0 0;
				background: white;
			}
			.text {
				display: inline-block;
				vertical-align: top;
				height: 42px;
				line-height: 42px;
			}
		}
		.top-part {
			width: 100%;
			padding: 15px;
			font-size: 16px;
			.top-avatar {
				position: relative;
				font-size: 0;
				width: 130px;
				height: 130px;
				display: table-cell;
				border-radius: 8PX;
				.top-listen {
					position: absolute;
					top: 5px;
					right: 0;
					font-size: 12px;
					color: white;
					vertical-align: top;
					i {
						font-size: 12px;
						vertical-align: top;
					}
				}
				img {
					width: 100%;
					height: 100%;
					border-radius: 5PX;
				}
			}
			.top-content {
				position: relative;
				width: 200px;
				padding-left: 15px;
				display: table-cell;
				vertical-align: top;
				.title {
					font-size: 18px;
					line-height: 1.2;
				}
				.top-people {
					margin-top: 5px;
					img {
						width: 22px;
						height: 22px;
						border-radius: 50%;
						vertical-align: middle;
					}
					.creator-name {
						display: inline-block;
						vertical-align: middle;
						font-size: 14px;
						i {
							font-size: 14px;
							vertical-align: middle;
						}
					}
				}
				.top-detail {
					position: absolute;
					margin-left: 15px;
					bottom: 0;
					left: 0;
					right: 0;
					font-size: 12px;
					line-height: 1.2;
					display: inline-block;
					.d-text {
						font-size: 12px;
						line-height: 1.2;
						vertical-align: bottom;
						display: inline-block;
						width: 90%;
						height: 28.8px;
						overflow: hidden;
					}
					i {
						line-height: 28.8px;
						font-size: 12px;
						display: inline-block;
					}
				}
			}
		}
		.choice {
			font-size: 0;
			text-align: center;
			box-sizing: border-box;
			width: 100%;
			display: flex;
			padding: 10px 32px;
			justify-content: space-between;
			.item {
				div {
					font-size: 16px;
				}
				i {
					font-size: 20px;
					display: inline-block;
					margin-bottom: 8px;
				}
				&:active {
					color: grey;
				}
			}
		}
		.all-song {
			width: 100%;
			box-sizing: border-box;
		}
	}
}
</style>
