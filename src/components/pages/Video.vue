<template>
  <div id="video">
		<div v-for="(item, i) in video" :key="i" class="item" @click="videoDetails(item.id)">
			<div class="image">
				<img :src="item.cover" alt="none">
			</div>
			<div class="title">{{item.name}}</div>
			<div class="people">
				{{format(item.duration/1000)}} {{item.artistName}} 播放{{item.playCount | normalizeNum}}次
			</div>
		</div>
	  <router-view></router-view>
  </div>
</template>

<script>
	export default {
		name: 'Video',
		data() {
		  return {
		    video: []
		  }
		},
		created() {
		  this.getAllData()
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
		  videoDetails(id) {
		    this.$router.push({
			    path: '/video/details',
			    query: {
			      id: id
			    }
		    })
		  },
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
		  getAllData() {
			  this.axios.get('/api/mv/all?area=韩国&limit=16&order=最新').then(res => {
			    console.log(res)
			    let { data } = res.data
			    this.video = data
				})
		  }
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#video {
	width: 100%;
	position: fixed;
	overflow: scroll;
	top: 50px;
	bottom: 60px;
	left: 0;
	.item {
		width: 100%;
		padding: 10px 16px;
		border-bottom: 1PX solid rgba(127,127,127,0.25);
		&:active {
			background: #d7edee;
		}
		.image {
			width: 100%;
			height: 200px;
			img {
				width: 100%;
				height: 100%;
				border-radius: 8PX;
			}
		}
		.title {
			border-bottom: 1PX solid rgba(127,127,127,0.3);
			width: 100%;
			font-size: 16px;
			padding: 10px 0;
			line-height: 1.2;
		}
		.people {
			width: 100%;
			height: 30px;
			font-size: 12px;
			color: #7e8c8d;
			line-height: 30px;
		}
	}
}
</style>
