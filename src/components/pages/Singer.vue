<template>
  <div id="singer">
		<my-header ref="myHeader" class="header" :title="title"></my-header>
	  <div class="bg-image" :style="bgStyle" ref="bgImage">
		  <div class="filter" ref="filter"></div>
	  </div>
	  <div class="bg-layer" ref="layer">11</div>
	  <scroll :scroll-y="true" :listen-scroll="listenScroll" :probe-type="probeType" class="lists" ref="list" @scroll="scroll">
			<div class="song-list-wrapper">
				<song-list :song-list="songLists" ref="playlist"></song-list>
			</div>
	  </scroll>
  </div>
</template>

<script>
	import {createSong} from '../../assets/js/song'
	import MyHeader from "../component/MyHeader";
  import Scroll from "../component/scroll";
  import SongList from "../component/SongList";
  export default {
		name: 'Singer',
	  data() {
		  return {
		    title: '',
		    scrollY: 0,
		    probeType: 3,
        listenScroll: true,
		    bgImage: '',
			  songLists: []
		  }
	  },
    components: {SongList, Scroll, MyHeader},
	  computed: {
		  bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
	  },
	  beforeRouteEnter(to,from,next) {
		  next(vm => {
		    vm.getAllData()
		  })
	  },
    created() {
		  this.title = this.$route.query.singer
		  this.getAllData()
		},
	  mounted() {
		  // console.log(this.$refs.bgImage.clientHeight)
		  // console.log(this.$refs.myHeader.$el.clientHeight)
		  this.imageHeight = this.$refs.bgImage.clientHeight
		  this.minTransalteY = -this.imageHeight + this.$refs.myHeader.$el.clientHeight
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
	  },
	  watch: {
      scrollY(newVal) {
        let translateY = Math.max(this.minTransalteY, newVal)
        let scale = 1
        let zIndex = 0
        let blur = 0
        const percent = Math.abs(newVal / this.imageHeight)
        if (newVal > 0) {
          scale = 1 + percent
          zIndex = 1
        } else {
          blur = Math.min(20, percent * 20)
        }

        this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
        this.$refs.filter.style['backdrop'] = `blur(${blur}px)`
        if (newVal < this.minTransalteY) {
					zIndex = 9
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${this.$refs.myHeader.$el.clientHeight}px`
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
        }
        this.$refs.bgImage.style['transform'] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex
      }
    },
		methods: {
		  scroll(pos) {
        this.scrollY = pos.y
      },
		  getAllData() {
		    let url = `/api/artists?id=${this.$route.query.id}`
		    this.axios.get(url).then(res => {
		      console.log(res)
			    let { artist } = res.data
			    let { hotSongs } = res.data
			    this.bgImage = artist.picUrl
			    this.songLists = this.normalizeSongs(hotSongs)
		    })
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
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#singer {
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	bottom: 60px;
	.header {
		font-weight: bolder;
		z-index: 10;
		background: none;
		position: absolute;
		top: 0;
		left: 0;
	}
	.bg-image {
		position: relative;
    width: 100%;
    height: 0;
		padding-top: 70%;
    transform-origin: top;
    background-size: cover;
		.filter {
			position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
		}
	}
	.bg-layer {
		position: relative;
    height: 100%;
	}
	.lists {
		position: fixed;
    top: 0;
    bottom: 60px;
    width: 100%;
	}
}
</style>
