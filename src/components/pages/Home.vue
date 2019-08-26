<template>
  <div id="home">
		<div class="category">
      <div v-for="(item, i) in homeArr" :key="i" class="cate-item">
        <img :src="item.icon" alt="none">
        <span>
          {{item.text}}
        </span>
      </div>
    </div>
		<van-collapse v-model="activeNames">
      <van-collapse-item :title="title_1" name="1">
        <div v-for="(item, i) in mySongList" :key="i" class="song-item" @click="getDetailData(item.id)">
          <div class="img-item">
            <img v-lazy="item.coverImgUrl" alt="none">
          </div>
          <div class="song-item-text">
            <div class="list-title">{{item.name}}</div>
            <div>{{item.trackCount}} 首</div>
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item :title="title_2" name="2">
        <div v-for="(item, i) in collectList" :key="i" class="song-item" @click="getDetailData(item.id)">
          <div class="img-item">
            <img v-lazy="item.coverImgUrl" alt="none">
          </div>
          <div class="song-item-text">
            <div class="list-title">{{item.name}}</div>
            <div>{{item.trackCount}} 首 by {{item.creator.nickname}}</div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		name: 'Home',
		data() {
		  return {
		    title_1: '创建的歌单',
        title_2: '收藏的歌单',
			  collectList: [],
        mySongList: [],
        activeNames: [],
		    homeArr: [{
          icon: require('@/assets/img/t_actionbar_music_selected.png'),
          text: '本地音乐'
        }, {
          icon: require('@/assets/img/t_dragonball_icn_rank.png'),
          text: '最近播放'
        }, {
          icon: require('@/assets/img/b38.png'),
          text: '下载管理'
        }, {
          icon: require('@/assets/img/t_dragonball_icn_radio.png'),
          text: '我的电台'
        }, {
          icon: require('@/assets/img/bde.png'),
          text: '我的收藏'
        }]
		  }
		},
		computed: {
      ...mapState({
        uid: 'uid'
      })
    },
		created() {
		  this.getAllData()
		},
		methods: {
		  getAllData() {
		    if (this.uid !== '') {
          var add = `/api/user/playlist?uid=${this.uid}`
          this.axios.post(add).then(res => {
            var data = res.data
            console.log(res)
            if (data.code === 200) {
              this.mySongList = data.playlist.filter(item => item.userId === this.uid)
              this.title_1 = this.title_1 + '(' + this.mySongList.length + ')'
              this.collectList = data.playlist.filter(item => item.userId !== this.uid)
              this.title_2 = this.title_2 + '(' + this.collectList.length + ')'
            }
          }).catch(err => {
            console.log(err)
          })
        }
		  },
			getDetailData(id) {
		    this.$router.push({
					path: '/songlist',
			    query: {
					  id: id
			    }
				})
			}
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#home {
	position: absolute;
	overflow: scroll;
  width: 100%;
  top: 50px;
  bottom: 60px;
	box-sizing: border-box;
	.category {
		width: 100%;
    border-bottom: 15px solid #efefef;
		.cate-item {
			width: 100%;
      height: 50px;
			&:not(:last-child) {
        border-bottom: 1PX solid gray;
      }
      &:active {
        background: rgba(207, 207, 207, 0.5);
      }
			span {
        font-size: 18px;
        line-height: 50px;
        vertical-align: top;
        display: inline-block;
        margin-left: 20px;
      }
			img {
        background: #bdbdbd;
        width: 50px;
        height: 100%;
      }
		}
	}
	.song-item {
		box-sizing: border-box;
		width: 100%;
    height: 60px;
    font-size: 0;
		.img-item {
      width: 50px;
      height: 50px;
      display: table-cell;
      vertical-align: middle;
      img {
        width: 100%;
        height: 100%;
        border-radius: 10PX;
      }
    }
		.song-item-text {
      height: 60px;
      display: table-cell;
      vertical-align: middle;
      padding-left: 15px;
      .list-title {
        width: 270px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
      }
      div {
        font-size: 12px;
      }
    }
		&:active {
      background: lavender;
    }
	}
}
</style>
