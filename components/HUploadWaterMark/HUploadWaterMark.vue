<template>
	<view class="H-flex H-flex-row">
		<view
			style="border-radius: 10rpx;width:210rpx; height:210rpx; overflow:hidden; margin:10rpx; font-size:0; position:relative;"
			v-for="(item, index) in modelValue" :key="index">
			<image :src="item.url" :data-imgurl="item.url" style="border-radius: 10rpx;" @tap="showImgs(index)"
				class="H-img" mode="aspectFill"></image>
			<view class="H-remove" @tap="removeImg(index)">
				<icon type="clear" size="24" color="rgba(0, 0, 0, 0.8)" />
			</view>
		</view>
		<view @tap="obtainAuth" class="H-flex H-flex-column H-bg-gray"
			style="width: 210rpx;height: 210rpx;overflow: hidden;margin: 10rpx;font-size: 0;position: relative">
			<text  style="font-size: 80rpx;height: 80rpx;line-height: 80rpx;margin-bottom: 20rpx;display: block;">
				+ </text>
			<text  style="font-size: 26rpx;line-height: 36rpx;text-align: center;display: block;">添加照片</text>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	const props = defineProps({
		name: {
			type: String,
			default: ''
		},
		showCamera: {
			type: Boolean,
			default: false
		},
		modelValue: {
			type: Array,
			default: () => []
		},
		limit: {
			type: [Number, String],
			default: 3
		},
	})
	const emit = defineEmits(['update:modelValue'])

	// 判断相机、相册、位置是否授权------------授权建议写在外面
	function getAuthInfo() {
		return new Promise((resolve, reject) => {
			uni.getSetting({
				success(res) {
					const authSetting = res.authSetting;
					if (authSetting['scope.camera'] && authSetting['scope.writePhotosAlbum'] &&
						authSetting['scope.userLocation']) {
						// 已经授权
						resolve()
					} else {
						reject('未授权')
					}
				}
			});
		})
	}
	
	// 判断权限
	function obtainAuth(){
		getAuthInfo().then(res => {
			 openCameraMark()
		}).catch(err => {
			console.log(err);
			getAuth()
		})
	}

	// 开启水印相机
	function openCameraMark() {
		if (props.modelValue.length >= props.limit) {
			uni.showToast({
				title: '最多上传' + props.limit + '张图片',
				icon: 'none'
			})
			return
		}
		if (!props.showCamera) {
			uni.navigateTo({
				url: '/pages/sweet/waterMark?list=' + JSON.stringify(props.modelValue),
				events: {
					acceptDataFromOpenedPage: function(res) {
						if (res.data === '-1') {
							uni.showToast({
								title: '位置解析失败，请联系管理员！',
								icon: 'none'
							})
							return
						}
						let list = res.data
						let last = list[list.length - 1]
						emit('update:modelValue', list)
						// 可写入图片上传接口
						// addImg(last.url).then(res => {
						// 	last.id = res
						// 	emit('update:modelValue', list)
						// })
					}
				}
			})
		}
	}

	// 手动授权【摄像头】
	function getAuth() {
		// 获取摄像头权限
		uni.getSetting({
			success(res) {
				const authSetting = res.authSetting;
				if (authSetting['scope.camera'] && authSetting['scope.writePhotosAlbum'] && authSetting[
						'scope.userLocation']) {
					// 已经授权
					cameraEnable.value = true;
				} else {
					// 未授权
					// 判断未授权选项
					let str = ''
					let chinastr = ''
					if (!authSetting['scope.camera']) {
						str = 'scope.camera'
						chinastr = '摄像头'
					} else if (!authSetting['scope.writePhotosAlbum']) {
						str = 'scope.writePhotosAlbum'
						chinastr = '相册'
					} else {
						str = 'scope.userLocation'
						chinastr = '位置'
					}
					uni.authorize({
						scope: str,
						success(resSuccess) {
							getAuthInfo().then(res => {
								openCameraMark()
							}).catch(err => {
								 getAuth()
							})
						},
						fail(resFail) {
							guideAuth(chinastr)
						}
					});
				}
			}
		});
	}

	function guideAuth(chinastr) {
		// 引导用户授权
		uni.showModal({
			title: '授权',
			content: '需要您授权获取' + chinastr + '权限',
			success: function(res) {
				if (res.confirm) {
					uni.openSetting({
						success(resOpenSetting) {
							const authSetting = resOpenSetting.authSetting
							if (authSetting && authSetting['scope.camera'] && authSetting[
									'scope.writePhotosAlbum'] && authSetting['scope.userLocation']) {
								openCameraMark()
							} else {
								// console.log('还有未授权的权限');
								getAuthInfo().then(res => {
									openCameraMark()
								}).catch(err => {
									 getAuth()
								})
							}
						}
					});
				} else if (res.cancel) {
					uni.showToast({
						icon: 'none',
						title: '您拒绝授权小程序获取' + chinastr + '权限',
						duration: 1500
					});
				}
			}
		});
	}

	// 预览
	function showImgs(index) {
		let imgs = [];
		for (let i = 0; i < props.modelValue.length; i++) {
			imgs.push(props.modelValue[i].url);
		}
		uni.previewImage({
			urls: imgs,
			current: index
		})
	}

	// 删除水印图片
	function removeImg(index) {
		if (!props.showCamera) {
			uni.showModal({
				content: '确定要删除这张照片吗？',
				cancelText: '取消',
				confirmText: '确认',
				success: res => {
					if (res.confirm) {
						let list = ref([...props.modelValue])
						list.value.splice(index, 1)
						emit('update:modelValue', list.value)
					}
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.H-flex {
		display: flex;

		&-row {
			flex-direction: row;
			flex-wrap: wrap;
		}

		&-column {
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}

	.H-bg-gray {
		background-color: #F8F8F8 !important;
	}


	.H-text {
		font-size: 26rpx;
		line-height: 36rpx;
		text-align: center;
	}

	.H-icon {
		font-size: 80rpx;
		height: 80rpx;
		line-height: 80rpx;
		margin-bottom: 20rpx;
	}

	.H-items {
		width: 210rpx;
		height: 210rpx;
		overflow: hidden;
		margin: 10rpx;
		font-size: 0;
		position: relative;
	}

	.H-remove {
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		line-height: 60rpx;
		text-align: center;
		font-size: 44rpx;
		position: absolute;
		z-index: 1;
		right: 0;
		bottom: 0;
	}

	.H-img {
		width: 210rpx;
		height: 210rpx
	}
</style>