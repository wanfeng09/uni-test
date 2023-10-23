<template>
	<view v-show="isPageLoading">
		<HCameraWaterMark v-model:isPageLoading="isPageLoading" :mainHeight="mainHeight" @onBack="onBack"></HCameraWaterMark>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { getCurrentInstance, ref } from 'vue'
	let { ctx }  = getCurrentInstance()
	let isPageLoading = ref(false)
	let mainHeight = ref(380)
	onLoad((option) => {
		// 获取系统信息，为 camera 组件设置高度
		uni.getSystemInfo({
			success: function(res) {
				mainHeight.value = res.windowHeight
			}
		});
	})
	
	// 拍照页面返回
	function onBack(evt){
		uni.navigateBack()
		let eventChannel  = ctx.getOpenerEventChannel()
		eventChannel.emit('acceptDataFromOpenedPage', {data: evt});
	}
</script>


<style>
</style>