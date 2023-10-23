<template>
	<view class="container">
		<view>
			<camera v-if="stopCamera" device-position="back" mode="scscanCode" flash="off" @error="error"
				@stop="stopPhoto" style="width: 100%; height: 300px;"></camera>
			<button type="primary" @click="() => stopCamera = true">开启摄像</button>
			<button v-if="stopCamera" type="primary" @click="takePhoto">拍照</button>
			<button type="primary" @click="() => stopCamera = false">关闭摄像</button>
			<button type="primary" @click="goUrl"></button>
			<button type="primary" @click="scanCode">扫描二维码</button>
			<view class="scan">
				二维码扫描类型：{{scanContent}}<br />
				二维码扫描结果：<text user-select style="word-wrap: break-word;">{{scanResult}}</text>
			</view>
			<view>预览</view>
			<image mode="widthFix" :src="src" show-menu-by-longpress></image>
		</view>
		
		
	</view>
</template>

<script setup>
	import { reactive, ref } from "vue";
	const src = ref('')
	const scanContent = ref('')
	const scanResult = ref('')
	let stopCamera = ref(false)
	
	let fileList = ref([])
	
	// 点击拍照
	function takePhoto() {
		const ctx = uni.createCameraContext();
		ctx.takePhoto({
			quality: 'high',
			success: (res) => {
				src.value = res.tempImagePath
			}
		});
	}

	function error(e) {
		console.log(e.detail);
	}
	
	// 
	function stopPhoto(e) {
		const ctx = uni.createCameraContext();
		console.log(e);
	}
	
	// 二维码扫码
	function scanCode() {
		uni.scanCode({
			success: function(res) {
				scanContent.value = res.scanType
				scanResult.value = res.result
				console.log(res);
			}
		});
	}
	
</script>

<style scoped>
	button {
		margin: 10px 0;
	}

	.container {
		padding: 20px;
	}

	.scan {
		background: #f5f5f5;
		min-height: 100px;
	}
</style>