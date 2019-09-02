<template>
  <div id="result">
		<div id="my-header">
      <div class="icon" @click="back">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <form action="/">
        <van-search v-model="value" placeholder="音乐、视频、歌词、电台" />
      </form>
    </div>
	  <div class="single" v-show="songs.length !== 0">
		  <div class="title">
			  <span>单曲</span>
			  <i class="iconfont icon-you"></i>
		  </div>
		  <ul>
			  <li v-for="(item, i) in songs" :key="i">
				  <div class="content">
					  <div class="name">{{item.name}}</div>
					  <div class="album">{{item.ar | initSinger}} - <span>{{item.al.name}}</span></div>
				  </div>
				  <div class="sandian">
					  <i class="iconfont icon-sandian"></i>
				  </div>
			  </li>
		  </ul>
	  </div>
	  <div class="video" v-show="videos.length !== 0">
		  <div class="title">
			  <span>视频</span>
			  <i class="iconfont icon-you"></i>
		  </div>
		  <ul>
			  <li v-for="(item, i) in videos" :key="i">
					<div class="image">
						<div class="listen">
							<i class="iconfont icon-play"></i>
							<span>{{item.playTime | normalizeNum}}</span>
						</div>
						<img :src="item.coverUrl" alt="none">
					</div>
				  <div class="content">
					  <div class="main">{{item.title}}</div>
					  <div class="detail">
						  {{format(item.durationms/1000)}} by {{item.creator[0].userName}}
					  </div>
				  </div>
			  </li>
		  </ul>
	  </div>
	  <div class="playlist" v-show="playLists.length !== 0">
		  <div class="title">
			  <span>歌单</span>
			  <i class="iconfont icon-you"></i>
		  </div>
		  <ul>
			  <li v-for="(item, i) in playLists" :key="i">
					<div class="image">
						<img :src="item.coverImgUrl" alt="none">
					</div>
				  <div class="content">
					  <div class="main">{{item.name}}</div>
					  <div class="detail">
						  {{item.trackCount}}首 by {{item.creator.nickname}} 播放{{item.playCount | normalizeNum}}次
					  </div>
				  </div>
			  </li>
		  </ul>
	  </div>
	  <div class="album" v-show="albums.length !== 0">
			<div class="title">
			  <span>专辑</span>
			  <i class="iconfont icon-you"></i>
		  </div>
		  <ul>
			  <li v-for="(item, i) in albums" :key="i">
					<div class="image">
						<img :src="item.picUrl" alt="none">
					</div>
				  <div class="content">
					  <div class="main">{{item.name}}</div>
					  <div class="detail">
						  {{item.artist.name}} - {{item.publishTime | formatDate}}
					  </div>
				  </div>
			  </li>
		  </ul>
	  </div>
	  <div class="radio" v-show="radios.length !== 0">
		  <div class="title">
			  <span>电台</span>
			  <i class="iconfont icon-you"></i>
		  </div>
		  <ul>
			  <li v-for="(item, index) in radios" :key="index+9">
				  <div class="image">
					  <img :src="item.picUrl" alt="none">
				  </div>
				  <div class="content">
					  <div class="name">{{item.name}}</div>
					  <div class="dj">{{item.dj.nickname}}</div>
				  </div>
			  </li>
		  </ul>
	  </div>
  </div>
</template>

<script>
	import { formatTimeToStr } from '../../assets/js/time'
	export default {
		name: 'SearchRes',
		data() {
		  return {
		    value: this.$route.query.value,
			  songs: [],
			  videos: [],
			  playLists: [],
			  albums: [],
			  radios: []
			}
		},
		filters: {
		  formatDate: function(time) {
        if(time!==null && time!=="") {
          var date = new Date(time);
          return formatTimeToStr(date, "yyyy.MM.dd");
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
		  initSinger(ar) {
				let singer = ''
			  if (ar.length === 1) {
			    singer = ar[0].name
			  } else {
			    ar.forEach(item => {
			      singer += item.name
			    })
			  }
			  return singer
		  }
		},
		beforeRouteEnter(to, from, next) {
		  next(vm => {
		    vm.getAllData()
		  })
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
		  back() {
		    this.$emit('changeN')
		    this.$router.go(-1)
      },
		  getAllData() {
		    let url = `/api/search?keywords=${this.$route.query.value}&type=1018`
		    this.axios.post(url).then(res => {
		      console.log(res)
			    let { result } = res.data
			    this.songs = result.song.songs
			    this.videos = result.video.videos
			    this.playLists = result.playList.playLists
			    this.albums = result.album.albums
			    if (result.hasOwnProperty('djRadio')) {
			      this.radios = result.djRadio.djRadios
			    }
		    })
		  }
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#result {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 60px;
	right: 0;
	z-index: 8;
	overflow-x: hidden;
	overflow-y: scroll;
	width: 100%;
	background: lavender;
	#my-header {
		z-index: 9;
		position: fixed;
		top: 0;
		left: 0;
    font-size: 0;
    width: 100%;
		vertical-align: top;
    .icon {
	    background: whitesmoke;
      display: inline-block;
      height: 54px;
      width: 56px;
      text-align: center;
      line-height: 54px;
      vertical-align: top;
      i {
        font-size: 16px;
      }
    }
    form {
	    vertical-align: top;
      display: inline-block;
      width: 319px;
    }
  }
	.single {
		margin-top: 56px;
		width: 100%;
		.title {
			width: 100%;
			font-size: 18px;
			height: 52px;
			line-height: 52px;
			padding-left: 10px;
			i {
				font-size: 18px;
			}
		}
		ul {
			width: 100%;
			li {
				height: 60px;
				font-size: 16px;
				padding-left: 12px;
				.content {
					white-space: nowrap;
					text-overflow: ellipsis;
					width: 315px;
					display: table-cell;
					vertical-align: middle;
					.name {
						margin-bottom: 5px;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.album {
						white-space: nowrap;
						text-overflow: ellipsis;
						font-size: 12px;
						color: deepskyblue;
						span {
							color: #7e8c8d;
						}
					}
				}
				.sandian {
					text-align: center;
					width: 60px;
					height: 60px;
					line-height: 60px;
					display: table-cell;
					vertical-align: middle;
				}
			}
		}
	}
	.video {
		margin-top: 16px;
		width: 100%;
		.title {
			width: 100%;
			font-size: 18px;
			height: 52px;
			line-height: 52px;
			padding-left: 10px;
			i {
				font-size: 18px;
			}
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
					.main {
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
	.playlist {
		margin-top: 16px;
		width: 100%;
		.title {
			width: 100%;
			font-size: 18px;
			height: 52px;
			line-height: 52px;
			padding-left: 10px;
			i {
				font-size: 18px;
			}
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
					img {
						border-radius: 8PX;
						line-height: 0;
						width: 80px;
						height: 100%;
					}
				}
				.content {
					text-align: left;
					display: table-cell;
					vertical-align: middle;
					width: 270px;
					padding: 0 5px;
					.main {
						font-size: 16px;
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
	.album {
		margin-top: 16px;
		width: 100%;
		.title {
			width: 100%;
			font-size: 18px;
			height: 52px;
			line-height: 52px;
			padding-left: 10px;
			i {
				font-size: 18px;
			}
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
					img {
						border-radius: 8PX;
						line-height: 0;
						width: 80px;
						height: 100%;
					}
				}
				.content {
					text-align: left;
					display: table-cell;
					vertical-align: middle;
					width: 270px;
					padding: 0 5px;
					.main {
						font-size: 16px;
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
	.radio {
		margin-top: 16px;
		width: 100%;
		.title {
			width: 100%;
			font-size: 18px;
			height: 52px;
			line-height: 52px;
			padding-left: 10px;
			i {
				font-size: 18px;
			}
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
					img {
						border-radius: 8PX;
						line-height: 0;
						width: 80px;
						height: 100%;
					}
				}
				.content {
					text-align: left;
					display: table-cell;
					vertical-align: middle;
					width: 270px;
					padding: 0 5px;
					.name {
						font-size: 16px;
						line-height: 1.2;
					}
					.dj {
						color: #7e8c8d;
						margin-top: 5px;
					}
				}
			}
		}
	}
}
</style>
