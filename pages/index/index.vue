<template>
	<view class="container">
		<navigator url="/pages/about/copytable" hover-class="navigator-hover">
			<button type="primary">表格复制粘贴</button>
		</navigator>
		<navigator url="/pages/about/canvasImg" hover-class="navigator-hover" style="margin-top: 30rpx;">
			<button type="primary">画布生成图片</button>
		</navigator>
		<navigator url="/pages/about/selectCanvasImg" hover-class="navigator-hover" style="margin-top: 30rpx;">
			<button type="primary">选择水印图片</button>
		</navigator>
		<navigator url="/pages/about/cameraWaterCanvas" hover-class="navigator-hover" style="margin-top: 30rpx;">
			<button type="primary">水印相机</button>
		</navigator>
	<!-- 	<navigator url="/pages/about/menusSwitch" hover-class="navigator-hover" style="margin-top: 30rpx;">
			<button type="primary">导航切换组件</button>
		</navigator> -->
	</view>
</template>
<script setup>
	import {
		reactive,
		ref
	} from "vue";
	import {
		onLoad
	} from '@dcloudio/uni-app'
</script>
<style scoped>
	.container {
		padding: 20px;
	}

	.uni-group {
		display: flex;
		align-items: center;
	}

	.copyContent {
		margin-top: 10px;
		min-height: 100px;
		padding: 10px;
		background-color: antiquewhite;
	}
</style>