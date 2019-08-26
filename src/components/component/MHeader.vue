<template>
  <div id="m-header">
    <div class="icon" @click="showPopUp">
      <i class="iconfont icon-RectangleCopy"></i>
    </div>
    <div class="tab-bar">
      <router-link tag="div" class="tab-item" to="/" exact>
        <span class="tab-link">我的</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/main">
        <span class="tab-link">发现</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/friend">
        <span class="tab-link">朋友</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/video">
        <span class="tab-link">视频</span>
      </router-link>
    </div>
    <div class="icon" @click="showSearch">
      <i class="iconfont icon-RectangleCopy1"></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MHeader',
    methods: {
      showPopUp() {
        this.$emit('showPopUp')
      },
      showSearch() {
        this.$router.push({
          path: '/search'
        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  #m-header {
    width: 100%;
    height: 50px;
    background: #ea2000;
    font-size: 0;
    .icon {
      display: inline-block;
      height: 50px;
      width: 54px;
      border: none;
      background: #7e8c8d;
      text-align: center;
      line-height: 50px;
      vertical-align: top;
      i {
        color: white;
        font-size: 20px;
      }
      &:active {
        background: #ccdadb;
      }
    }
    .tab-bar {
      display: inline-block;
      margin:0 13.5px;
      text-align: center;
      .tab-item {
        vertical-align: top;
        display: inline-block;
        height: 50px;
        width: 60px;
        border: none;
        line-height: 50px;
        /*-webkit-transition-property: background-color;*/
        /*-webkit-transition-duration: 0.1s;*/
        /*-webkit-transition-timing-function: ease;*/
        &:active {
            background-color: rgba(207, 207, 207, 0.5);
            /*-webkit-tap-highlight-color:rgba(207, 207, 207, 0.5);*/
        }
        .tab-link {
          font-size: 16px;
          color: #ecfeff;
          opacity: 0.5;
        }
        &.router-link-active {
          .tab-link {
            color: black;
            opacity: 1;
            font-size: 20px;
            font-weight: bolder;
          }
        }
      }
    }
  }
</style>
