<template>
	<view class="">
		<h3>开启水印相机</h3>
		<HUploadWaterMark v-model="imgLists"></HUploadWaterMark>
	</view>
</template>

<script setup>
	import { reactive, ref } from "vue";
	let imgLists = ref([])
</script>

<style>
</style>