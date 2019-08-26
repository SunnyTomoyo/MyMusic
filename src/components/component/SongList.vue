<template>
  <div id="song-list" ref="songs" v-if="songList.length > 0">
		<div class="song-item" ref="aa" v-for="(item, i) in songList" :key="i" @click.prevent="singASong(i)">
			<div class="num">{{i+1}}</div>
			<div class="song-mess">
				<div class="song-name">{{item.name}}</div>
				<div class="album-name">{{item.singer}} - {{item.album}}</div>
			</div>
			<i class="iconfont icon-sandian" @click.stop="setMess(songList[i]);showMess()"></i>
		</div>
  </div>
</template>

<script>
	import { mapMutations } from 'vuex'
	export default {
		name: 'SongList',
		props: {
		  songList: Array
		},
		methods: {
		  details(i) {
		    this.$emit('changeIndex', i)
		  },
		  ...mapMutations({
			  setMess: 'SET_MESS',
			  showMess: 'SET_MESSSHOW',
			  setPlaylist: 'SET_PLAYLIST',
			  setSong: 'SET_PLAYINGSONG',
			  setSongUrl: 'SET_SONGURL',
			  setIndex: 'SET_CURRENTINDEX'
		  }),
		  singASong(index) {
				this.setPlaylist(this.songList)
			  let { id } = this.songList[index]
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
					  this.setPlaylist(arr)
					  this.setIndex(-1)
			      this.setSong(obj)
				    this.setSongUrl(str)
				  } else {
				    this.setIndex(index)
			      this.setSong(this.songList[index])
				    this.setSongUrl(data[0].url)
				  }
			  }).catch(err => {
			    console.log(err)
			  })
		  }
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#song-list {
	background: white;
	.song-item {
		width: 100%;
		height: 60px;
		font-size: 0;
		i {
			color: grey;
			font-size: 16px;
			display: table-cell;
			width: 40px;
			height: 60px;
			text-align: center;
			vertical-align: middle;
			&:active {
				background: #efefef;
			}
		}
		.num {
			display: table-cell;
			vertical-align: top;
			font-size: 16px;
			text-align: center;
			width: 50px;
			height: 60px;
			line-height: 60px;
			color: grey;
		}
		.song-mess {
			width: 285px;
			display: table-cell;
			font-size: 16px;
			height: 60px;
			vertical-align: middle;
			.song-name {
				line-height: 1.3;
				width: 285px;
				margin-bottom: 8px;
				overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
			}
			.album-name {
				line-height: 1.3;
				width: 285px;
				color: grey;
				font-size: 12px;
				overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
			}
		}
		&:active {
			background: rgba(215,215,215, 0.4);
		}
	}
}
</style>
