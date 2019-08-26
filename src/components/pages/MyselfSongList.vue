<template>
  <div id="myself-list">
		<div class="title">歌单 <span>{{mySongList.length}}</span></div>
	  <div class="my-list" :key="i+33" v-for="(item, i) in mySongList">
		  <div class="image">
			  <img :src="item.coverImgUrl" alt="none">
		  </div>
		  <div class="content">
			  <div class="name">{{item.name}}</div>
			  <div class="count">{{item.trackCount}}首，播放{{item.playCount}}次</div>
		  </div>
	  </div>
	  <div class="title aa">收藏的歌单 <span>{{collectList.length}}</span></div>
	  <div class="my-list" :key="index" v-for="(item, index) in collectList">
		  <div class="image">
			  <img :src="item.coverImgUrl" alt="none">
		  </div>
		  <div class="content">
			  <div class="name">{{item.name}}</div>
			  <div class="count">{{item.trackCount}}首，by {{item.creator.nickname}}，播放{{item.playCount | normalizeNum}}次</div>
		  </div>
	  </div>
  </div>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		name: 'MyselfSongList',
		data() {
		  return {
		    mySongList: [],
			  collectList: []
		  }
		},
		created() {
		  this.getAllSongList()
		},
		computed: {
      ...mapState({
        uid: 'uid'
      })
    },
		filters: {
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
		  getAllSongList() {
		    var add = `/api/user/playlist?uid=${this.uid}`
		    this.axios.post(add).then(res => {
          var data = res.data
          console.log(res)
          if (data.code === 200) {
            this.mySongList = data.playlist.filter(item => item.userId === this.uid)
            // this.title_1 = this.title_1 + '(' + this.mySongList.length + ')'
            this.collectList = data.playlist.filter(item => item.userId !== this.uid)
	          this.$emit('showOne')
            // this.title_2 = this.title_2 + '(' + this.collectList.length + ')'
          }
        }).catch(err => {
          console.log(err)
        })
		  }
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#myself-list {
	box-sizing: border-box;
	width: 375px;
	padding: 16px;
	.aa {
		margin-top: 16px;
	}
	.title {
		margin-bottom: 16px;
		font-size: 16px;
		font-weight: bolder;
		span {
			color: #bdbdbd;
			font-size: 12px;
		}
	}
	.my-list {
		padding-bottom: 20px;
		width: 100%;
		height: 70px;
		display: table-row;
		.image {
			display: table-cell;
			line-height: 0;
			vertical-align: middle;
			height: 60px;
			width: 60px;
			img {
				width: 100%;
				height: 100%;
				border-radius: 4PX;
			}
		}
		.content {
			padding-left: 16px;
			display: table-cell;
			vertical-align: middle;
			.name {
				line-height: 1.3;
				overflow: hidden;
				width: 267px;
				white-space: nowrap;
				text-overflow: ellipsis;
				font-size: 16px;
				margin-bottom: 8px;
			}
			.count {
				font-size: 12px;
				color: #bdbdbd;
			}
		}
	}
}
</style>
