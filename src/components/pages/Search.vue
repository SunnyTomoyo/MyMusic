<template>
  <div id="search">
		<div id="my-header">
      <div class="icon" @click="back">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <form action="/">
        <van-search v-model="value" placeholder="音乐、视频、歌词、电台" @search="onSearch"/>
      </form>
    </div>
	  <div class="main-content">
		  <div class="history" v-if="hasWord.length > 0">
			  <div class="title">
				  <span>历史记录</span>
	        <van-icon name="delete" @click="deleteWords"/>
			  </div>
	      <scroll class="word" ref="word" :scroll-x="true">
		      <ul ref="ulItem">
			      <li v-for="(item, i) in hasWord" :key="i">
				      {{item}}
			      </li>
		      </ul>
	      </scroll>
	    </div>
		  <div class="hit">
			  <div class="title">热搜榜</div>
			  <ul>
				  <li v-for="(item, i) in hitArr" :key="i" @click="searchKey(item.searchWord)">
					  <div class="num" :style="i < 3 ? 'color: red' : 'color: grey'">{{i+1}}</div>
					  <div class="hit-content">
							<div class="hit-name" :style="i < 3 ? 'fontWeight: bolder' : 'fontWeight: normal'">
								{{item.searchWord}}
								<span>{{item.score}}</span>
							</div>
							<div class="hit-detail">
								{{item.content}}
							</div>
					  </div>
				  </li>
			  </ul>
		  </div>
	  </div>
	  <router-view @changeN="changeN"></router-view>
  </div>
</template>

<script>
	import Scroll from "../component/scroll";
  export default {
		name: 'Search',
    components: {Scroll},
	  data() {
		  return {
		    hasWord: [],
		    value: '',
		    hitArr: [],
			  backNum: -1,
		  }
	  },
	  created() {
		  console.log('life')
		  this.getHit()
	  },
	  mounted() {
	  },
	  beforeRouteLeave(to, from, next) {
	    if (to.name === 'SearchRes') {
	      this.$route.meta.keepAlive = false
	    }
	    next()
	  },
	  beforeRouteEnter(to, from, next) {
		  next(vm => {
			  vm.value = ''
				let word = localStorage.getItem('oldWord')
			  if (word) {
			    vm.hasWord = JSON.parse(word)
			  } else {
			    localStorage.setItem('oldWord', '')
			  }
			  setTimeout(()=> {
			    if (vm.hasWord.length) {
				    vm._setSliderWidth()
				  }
			  }, 30)
		  })
	  },
	  watch: {
		  backNum(newV) {
		    if (newV === 0) {
					this._setSliderWidth()
			    this.$refs.word.refresh()
		    }
		  }
	  },
	  methods: {
		  changeN() {
		    this.backNum = 0
			  console.log(this.backNum)
		  },
		  deleteWords() {
				localStorage.setItem('oldWord', '')
			  this.hasWord = []
		  },
		  searchKey(word) {
		    this.value = word
			  this.onSearch()
		  },
		  setWords() {
		    let word = localStorage.getItem('oldWord')
			  if (!word) {
				  let str = ''
				  this.hasWord.push(this.value)
				  str = JSON.stringify(this.hasWord)
				  localStorage.setItem('oldWord', str)
			  } else {
			    let str = ''
			    console.log(word)
			    this.hasWord = JSON.parse(word)
				  this.hasWord.unshift(this.value)
				  this.hasWord = Array.from(new Set(this.hasWord))
				  if (this.hasWord.length > 10) {
				    this.hasWord.splice(10,1)
				  }
				  str = JSON.stringify(this.hasWord)
				  localStorage.setItem('oldWord', str)
			  }
		  },
		  onSearch() {
		    this.setWords()
			  this.backNum = 1
			  console.log(this.backNum)
				this.$router.push({
					path: '/search/word',
					query: {
					  value: this.value
			    }
				})
		  },
		  getHit() {
		    let word = localStorage.getItem('oldWord')
			  if (word) {
			    this.hasWord = JSON.parse(word)
				  setTimeout(()=> {
			    if (this.hasWord.length) {
				    this._setSliderWidth()
				  }
			  }, 300)
			  } else {
			    localStorage.setItem('oldWord', '')
			  }
        this.axios.post('/api/search/hot/detail').then(res => {
          console.log(res)
          this.hitArr = res.data.data
        }).catch(err => {
          console.log(err)
        })
	    },
		  back() {
        this.$router.go(-1)
			  this.backNum = -1
      },
      _setSliderWidth() {
        this.children = this.$refs.ulItem.children
				let width = 0
	      for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          width += (child.clientWidth + 5)
		      console.log(child.clientWidth)
        }
	      width -= 5
	      this.$refs.ulItem.style.width = width + 'px'
      }
	  }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
#search {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 6;
	#my-header {
    font-size: 0;
    width: 100%;
    .icon {
	    background: whitesmoke;
      display: inline-block;
      height: 56px;
      width: 56px;
      text-align: center;
      line-height: 56px;;
      vertical-align: top;
      i {
        font-size: 16px;
      }
    }
    form {
      display: inline-block;
      width: 319px;
	    height: 56px;
	    /deep/ .van-search {
		    height: 100%;
	    }
    }
  }
	.main-content {
		overflow-x: hidden;
		background: #8bd3ff;
		margin-bottom: 60px;
		overflow-y: scroll;
		position: fixed;
		top: 56px;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 6;
		.history {
			width: 100%;
			padding: 25px 15px;
			.title {
				height: 24px;
				line-height: 24px;
				font-size: 16px;
				width: 100%;
				span {
					font-weight: bolder;
				}
				/deep/ .van-icon {
					line-height: 24px;
		      font-size: 20px;
		      float: right;
		    }
			}
			.word {
				width: 100%;
				overflow: hidden;
				margin-top: 15px;
				font-size: 0;
				ul {
          white-space: nowrap;
					li {
						background: #7e8c8d;
						text-align: center;
						padding: 8px 10px;
						border-radius: 10px;
						font-size: 16px;
						display: inline-block;
						&:not(:last-child) {
						  margin-right: 5px;
					  }
					}
				}
			}
		}
		.hit {
			width: 100%;
			padding: 15px;
			.title {
				font-size: 16px;
				font-weight: bolder;
				margin-bottom: 15px;
			}
			ul {
				width: 100%;
				li {
					width: 100%;
					height: 60px;
					font-size: 0;
					display: table-row;
					.num {
						font-size: 16px;
						display: inline-block;
						width: 32px;
						height: 60px;
						line-height: 60px;
					}
					.hit-content {
						display: table-cell;
						vertical-align: middle;
						width: 100%;
						height: 60px;
						.hit-name {
							font-size: 18px;
							font-weight: bolder;
							span {
								color: grey;
								font-size: 12px;
							}
						}
						.hit-detail {
							color: grey;
							margin-top: 8px;
							overflow: hidden;
			        text-overflow: ellipsis;
			        white-space: nowrap;
							font-size: 12px;
						}
					}
				}
			}
		}
	}
}
</style>
