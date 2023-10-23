<template>
	<view class="">
		<h3>生成水印图片</h3>
		<HChooseWaterMark v-model="fileList"></HChooseWaterMark>
	</view>
</template>

<script setup>
	import { reactive, ref } from "vue";
	let fileList = ref([])
</script>

<style>
</style>