<template>
  <div id="main">
		<div v-if="banner.length" id="banner" ref="sliderWrapper">
      <slider>
        <div v-for="(item, index) in banner" :key = "index">
          <img :src="item.imageUrl" alt="none">
        </div>
      </slider>
    </div>
	  <div id="main-title">
      <div class="item" v-for="(item, i) in iconArr" :key="i">
        <div class="title-icon">
          <div class="day" v-if="i === 0">{{date}}</div>
          <img :src="item.icon" alt="none">
        </div>
        {{item.text}}
      </div>
    </div>
		<div id="recommend">
			<div class="sl-title">推荐歌单</div>
			<div class="sl-items">
        <div v-for="(item, i) in songList" :key="i" class="sl-item">
          <div class="sl-img-item">
            <img :src="item.picUrl" alt="none">
            <div class="people">
              <i class="iconfont icon-play"></i>{{item.playCount | normalizeNum}}
            </div>
          </div>
          <div class="sl-name">{{item.name}}</div>
        </div>
      </div>
		</div>
	  <div id="new-song">
			<div class="sl-title">推荐新歌</div>
			<div class="sl-items">
        <div v-for="(item, i) in newSong" :key="i" class="sl-item">
          <div class="sl-img-item">
            <img :src="item.song.album.picUrl" alt="none">
          </div>
          <div class="sl-name">{{item.name}}</div>
          <div class="sl-singer">{{item.song.artists | singer}}</div>
        </div>
      </div>
		</div>
	  <div id="new-album">
			<div class="sl-title">推荐新专</div>
			<div class="sl-items">
        <div v-for="(item, i) in newAlbum" :key="i" class="sl-item">
          <div class="sl-img-item">
            <img :src="item.picUrl" alt="none">
          </div>
          <div class="sl-name">{{item.name}}</div>
          <div class="sl-singer">{{item.artists | singer}}</div>
        </div>
      </div>
		</div>
  </div>
</template>

<script>
	import Slider from '../component/Slider'
	export default {
		name: 'Main',
		components: {
      Slider
    },
		data() {
		  return {
		    songList: [],
		    newSong: [],
		    newAlbum: [],
		    date: 0,
		    banner: [],
			  iconArr: [{
          icon: require('@/assets/img/t_dragonball_icn_daily.png'),
          text: '每日推荐'
        }, {
          icon: require('@/assets/img/t_dragonball_icn_playlist.png'),
          text: '歌单'
        }, {
          icon: require('@/assets/img/t_dragonball_icn_rank.png'),
          text: '排行榜'
        }, {
          icon: require('@/assets/img/t_dragonball_icn_radio.png'),
          text: '电台'
        }, {
          icon: require('@/assets/img/t_dragonball_icn_look.png'),
          text: '直播'
        }]
		  }
		},
		created() {
		  this.getAllData()
		  this.getNumber()
			this.getSongList()
		},
		filters: {
		  singer(arr) {
		    let str = ''
			  if (arr.length > 1) {
			    let num = arr.length
			    arr.forEach((item, i) => {
			      if (i === num-1) {
			        str += item.name
			      } else {
			        str += item.name + '/'
			      }
				  })
				  return str
			  } else {
			    return arr[0].name
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
		  getSongList() {
        this.axios.post('/api/personalized').then(res => {
          console.log(res)
          this.songList = res.data.result.filter((item, i) => i<6)
          console.log(this.songList)
        }).catch(err => {
          console.log(err)
        })
        this.axios.post('/api/personalized/newsong').then(res => {
          console.log(res)
	        let { result } = res.data
	        this.newSong = result.filter((item, i) => i<6)
        }).catch(err => {
          console.log(err)
        })
        this.axios.post('/api/album/newest').then(res => {
          console.log(res)
	        let { albums } = res.data
	        this.newAlbum = albums.filter((item, i) => i<6)
        }).catch(err => {
          console.log(err)
        })
      },
		  getNumber() {
        let day = new Date();
        this.date = day.getDate()
      },
		  getAllData() {
        this.axios.get('/api/banner').then(res => {
          this.banner = res.data.banners
        })
      }
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#main {
	position: absolute;
	overflow: scroll;
  width: 100%;
  top: 50px;
  bottom: 60px;
	box-sizing: border-box;
	#banner {
		width: 100%;
		overflow: hidden;
		height: 138px;
	}
	#main-title {
		box-sizing: border-box;
		text-align: center;
		width: 100%;
		padding: 15px;
    border-bottom: 1PX solid #aeaeae;
    display: flex;
    justify-content: space-between;
		.item {
			.title-icon {
				position: relative;
				margin-bottom: 5px;
				border-radius: 50%;
				width: 46px;
				height: 46px;
				background: navajowhite;
				.day {
					color: navajowhite;
					line-height: 50px;
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
				}
				img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	#recommend {
		box-sizing: border-box;
		width: 100%;
		padding: 15px;
		.sl-title {
      font-size: 16px;
      letter-spacing: 2PX;
      font-weight: bolder;
      margin-bottom: 10px;
    }
		.sl-items {
			width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
			.sl-item {
				margin-bottom: 13px;
				letter-spacing: 1PX;
				width: 32%;
				.sl-img-item {
					color: white;
					width: 100%;
          position: relative;
					margin-bottom: 5px;
					img {
						width: 100%;
						height: 100%;
						border-radius: 5PX;
					}
					.people {
						line-height: 16px;
						font-size: 12px;
						position: absolute;
						top: 0;
						right: 5px;
						i {
							font-size: 12px;
						}
					}
				}
				.sl-name {
					display: -webkit-box;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					width: 100%;
					font-size: 12px;
					line-height: 1.2;
					height: 28.8px;
					overflow: hidden;
				}
			}
		}
	}
	#new-song {
		width: 100%;
		padding: 15px;
		.sl-title {
      font-size: 16px;
      letter-spacing: 2PX;
      font-weight: bolder;
      margin-bottom: 10px;
    }
		.sl-items {
			width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
			.sl-item {
				margin-bottom: 13px;
				letter-spacing: 1PX;
				width: 32%;
				.sl-img-item {
					color: white;
					width: 100%;
          position: relative;
					margin-bottom: 5px;
					img {
						width: 100%;
						height: 100%;
						border-radius: 5PX;
					}
				}
				.sl-name {
					display: -webkit-box;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 100%;
					font-size: 14px;
					line-height: 1.3;
					overflow: hidden;
				}
				.sl-singer {
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 100%;
					color: gray;
					font-size: 12px;
					line-height: 1.3;
					overflow: hidden;
				}
			}
		}
	}
	#new-album {
		width: 100%;
		padding: 15px;
		.sl-title {
      font-size: 16px;
      letter-spacing: 2PX;
      font-weight: bolder;
      margin-bottom: 10px;
    }
		.sl-items {
			width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
			.sl-item {
				margin-bottom: 13px;
				letter-spacing: 1PX;
				width: 32%;
				.sl-img-item {
					color: white;
					width: 100%;
          position: relative;
					margin-bottom: 5px;
					img {
						width: 100%;
						height: 100%;
						border-radius: 5PX;
					}
				}
				.sl-name {
					display: -webkit-box;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 100%;
					font-size: 14px;
					line-height: 1.3;
					overflow: hidden;
				}
				.sl-singer {
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 100%;
					color: gray;
					font-size: 12px;
					line-height: 1.3;
					overflow: hidden;
				}
			}
		}
	}
}
</style>
