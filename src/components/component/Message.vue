<template>
  <div id="message">
	  <div class="mask" @click="showMess"></div>
	  <div class="content">
		  <div class="item" :key="i" v-for="(item, i) in mess.sid" @click="getSinger(item.id, item.name)">
				<div class="icon">
				  <i class="iconfont icon-singer"></i>
			  </div>
			  <div class="text">
				  歌手：{{item.name}}
			  </div>
			</div>
		  <div class="item">
			  <div class="icon">
				  <i class="iconfont icon-zhuanji"></i>
			  </div>
			  <div class="text">
			    专辑：{{mess.album}}
			  </div>
		  </div>
	  </div>
  </div>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	export default {
		name: 'Message',
		data() {
		  return {
		    arr: [],
			  album: ''
		  }
		},
		computed: {
		  ...mapState({
			  mess: 'mess',
			  playingSong: 'playingSong'
		  })
		},
		methods: {
		  ...mapMutations({
			  showMess: 'SET_MESSSHOW'
		  }),
			getSinger(id, singer) {
		    this.$router.push({
					path: '/singer',
			    query: {
					  id: id,
				    singer: singer
			    }
				})
				this.showMess()
			}
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#message {
	font-size: 16px;
	top: 0;
	width: 100%;
	z-index: 361;
	position: fixed;
	bottom: 0;
	left: 0;
	.mask {
		width: 100%;
		height: 100%;
		background: black;
		opacity: 0.3;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 5;
	}
	.content {
		padding-top: 20px;
		width: 100%;
		background: whitesmoke;
		border-radius: 20px 20px 0 0;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 200;
		.item {
			width: 100%;
			height: 42px;
			/*background: deepskyblue;*/
			padding-left: 20px;
			font-size: 0;
			margin-bottom: 5px;
			.icon {
				line-height: 42px;
				display: inline-block;
				height: 42px;
				width: 42px;
				i {
					font-size: 20px;
				}
			}
			.text {
				vertical-align: top;
				text-overflow: ellipsis;
        white-space: nowrap;
				width: 303px;
				overflow: hidden;
				border-bottom: 1PX solid rgba(128,128,128,0.1);
				display: inline-block;
				height: 42px;
				line-height: 42px;
				font-size: 16px;
			}
		}
	}
}
</style>
