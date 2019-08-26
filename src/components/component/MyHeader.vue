<template>
  <div class="head">
		<div class="icon" @click="back">
			<i class="iconfont icon-fanhui"></i>
		</div>
		{{title}}
	</div>
</template>

<script>
	export default {
		name: 'MyHeader',
		props: {
		  title: String
		},
		methods: {
		  back() {
		    this.$router.go(-1)
		  }
		}
	}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.head {
	width: 100%;
	height: 50px;
	font-size: 16px;
	color: white;
	background: #dddddd;
	.icon {
		width: 40px;
		height: 80px;
		line-height: 50px;
		text-align: center;
		display: inline-block;
		i {
			font-size: 22px;
		}
	}
}
</style>
