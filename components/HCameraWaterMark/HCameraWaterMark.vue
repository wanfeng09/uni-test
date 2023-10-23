<template>
	<view>
		<view v-if="loaded && cameraEnable">
			<camera :device-position="device" :flash="flash" @error="error" resolution="high"
				:style="{ width: '100%',position: 'relative', height: mainHeight + 'px' }">
				<cover-view class="waterMark-center">
					<cover-view class="waterMark">
						<!-- 时间 -->
						<cover-view class="dec">{{nowDate}}</cover-view>
						<!-- 地址 -->
						<cover-view class="dec">{{address}}</cover-view>
					</cover-view>
				</cover-view>


				<!-- 旋转摄像头 -->
				<cover-image @click="cameraRotate" class="rotate" src="/static/camera/rotate.png"></cover-image>
				<!-- 打开/关闭 闪关灯 -->
				<cover-image @click="switchLights" class="lights" :src="lightsImg"></cover-image>
				<!-- 拍照 -->
				<cover-view class="cameraBtn" @click="takePhoto">
					<cover-view class="cameraBtn-inner"></cover-view>
				</cover-view>

				<!-- 底部预览生成图片 -->
				<cover-view class="bottomBg" v-if="fileList.length > 0">
					<cover-view>
						<cover-view @click="ViewImage(index)" class="imgBox" v-for="(item,index) in fileList"
							:key="index">
							<cover-image class="imgItem" :src="item.url" mode="aspectFill"></cover-image>
							<cover-view class="cu-tag" @tap.stop="DelImg" :data-index="index">
								<cover-image class="iconClose" src="/static/camera/close.png"
									mode="aspectFill"></cover-image>
							</cover-view>
						</cover-view>
					</cover-view>
				</cover-view>
			</camera>
			<!-- canvas元素，利用它的功能，实现添加水印 -->
			<canvas :style="{ width: cwidth + 'px', height: cheight + 'px', position: 'absolute', top: '-999999999px'}"
				canvas-id="firstCanvas"></canvas>
		</view>
		<view v-else>
			相机不可用
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		toRefs,
		getCurrentInstance,
		computed,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'
	import { getCurrentDate } from '@/common/date.js'
	// 引入SDK核心类
	// import QQMapWX from '@/common/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js'
	const props = defineProps({
		// camera 组件高度
		mainHeight: {
			type: Number,
			default: 380
		},
		isPageLoading: {
			type: Boolean,
			default: false
		}
	})
	const emit = defineEmits(['onBack', 'update:isPageLoading'])

	let { ctx } = getCurrentInstance()

	let loaded = ref(false)
	let cameraEnable = ref(false)
	// 防止mounted与onShow冲突
	let loop = ref(false)

	let fileList = ref([])

	let data = reactive({
		device: 'back', //前置或后置摄像头，值为front, back
		flash: 'off', // 闪光灯，值为auto, on, off
		nowDate: '',
		address: 'test当前地址信息当前地址信息', //当前地址信息
		cwidth: 50, // canvas 元素宽度
		cheight: 50 // canvas 元素高度
	})

	let {
		device,
		flash,
		nowDate,
		address,
		cwidth,
		cheight
	} = toRefs(data)

	let lightsImg = computed(() => {
		return data.flash === 'off' ? '/static/camera/lights_on.png' : '/static/camera/lights.png'
	})

	onLoad((option) => {

		if (option.list.length > 0) {
			fileList.value = JSON.parse(option.list)
		}
		// 获取当前日期时间
		data.nowDate = getCurrentDate()
	})

	onShow(() => {
		if (loaded.value && !loop.value) {
			// 轮询当前相机权限状态，当用户授权则将cameraEnable设置为true
			loopGetCameraInfo()
		}
	})

	onMounted(() => {
		setTimeout(() => {
			loaded.value = true
			loopGetCameraInfo()
		}, 1000);
	})

	function loopGetCameraInfo() {
		loop.value = true;
		getAuthInfo();
		setTimeout(() => {
			if (!loaded.value) {
				loopGetCameraInfo()
			} else {
				if (!cameraEnable.value) {
					loopGetCameraInfo()
				} else {
					loop.value = false
				}
			}
		}, 500);
	}



	// 判断相机、相册、位置是否授权------------授权建议写在外面
	function getAuthInfo() {
		uni.getSetting({
			success(res) {
				const authSetting = res.authSetting;
				if (authSetting['scope.camera'] && authSetting['scope.writePhotosAlbum'] && authSetting[
						'scope.userLocation']) {
					// 已经授权
					emit('update:isPageLoading', true)
					cameraEnable.value = true;
					// getLocation()
				} else {
					emit('update:isPageLoading', true)
					cameraEnable.value = false;
				}
			}
		});
	}


	function saveImg(path) {
		// 已经授权
		uni.saveImageToPhotosAlbum({
			filePath: path,
			complete(res) {
				// console.log('保存图片', res);
			}
		})
	}

	// 获取当前地址
	function getLocation() {
		// 获取当前位置信息
		// uni.getLocation({
		// 	type: 'gcj02',
		// 	success: function(res) {
		// let qqmapsdk = new QQMapWX({
		// 	key: "自己申请的腾讯地图key"
		// })
		// // 根据经纬度反解析出地址名称
		// qqmapsdk.reverseGeocoder({
		// 	location: {
		// 		latitude: res.latitude,
		// 		longitude: res.longitude
		// 	},
		// 	success(addressRes) {
		// data.address = ''
		// 	},
		// 	fail(err) {
		// 		// getLocation()
		// 		console.log(err, '获取地址失败');

		// 	}
		// })
		// },
		// fail(err) {
		// 	console.log(err);
		// 	uni.showToast({
		// 		title: err.errMsg,
		// 		icon: 'none'
		// 	})
		// }
		// })
	}
	// 旋转摄像头
	function cameraRotate() {
		if (data.device == 'front') {
			data.device = 'back'
		} else {
			data.device = 'front'
		}
	}
	// 打开/关闭 闪光灯
	function switchLights() {
		data.flash = data.flash === 'off' ? 'on' : 'off'
	}
	// 删除水印照片
	function DelImg(e) {
		let index = e.currentTarget.dataset.index
		uni.showModal({
			content: '确定要删除这张照片吗？',
			cancelText: '取消',
			confirmText: '确认',
			success: res => {
				if (res.confirm) {
					fileList.value.splice(index, 1)
				}
			}
		})
	}
	// 查看照片
	function ViewImage(index) {
		let imgs = [];
		for (let i = 0; i < ileList.value.length; i++) {
			imgs.push(ileList.value[i].url);
		}
		uni.previewImage({
			urls: imgs,
			current: index
		})
	}

	// 点击拍照
	function takePhoto() {
		if (!data.address) {
			uni.showToast({
				title: '请重新获取当前位置',
				icon: 'none'
			})
			return
		}
		uni.showLoading({
			mask: true
		})
		// 创建并返回 camera 组件的上下文 cameraContext 对象
		const cameraContext = uni.createCameraContext();
		// 拍照
		cameraContext.takePhoto({
			quality: 'high', // 图片质量高
			success: (res) => {
				let tempImagePath = res.tempImagePath; // 临时图片路径
				uni.getImageInfo({
					src: tempImagePath,
					success(imgRes) {
						data.cwidth = imgRes.width / 3
						data.cheight = imgRes.height / 3
						drawWaterMark(imgRes.path)
					},
					fail() {
						uni.hideLoading()
					}
				})
			}
		});
	}
	// 画水印
	function drawWaterMark(path) {
		let markctx = uni.createCanvasContext('firstCanvas', ctx)
		markctx.drawImage(path, 0, 0, data.cwidth, data.cheight);
		markctx.setFontSize(14); // 设置字体大小为 10px
		markctx.setFillStyle('#FFFFFF'); // 设置颜色为白色
		let textToWidth = data.cwidth * 0.03; // 绘制文本的左上角x坐标位置
		let textToHeight1 = data.cheight * 0.10; // 绘制文本的左上角y坐标位置
		// let textToHeight2 = data.cheight * 0.16;
		// 绘制日期和时间
		markctx.fillText(data.nowDate, textToWidth, textToHeight1);
		let first = 0
		for (var i = 0; i < data.address.length; i++) {
			if (first > data.address.length) {
				break
			}
			let str = data.address.substring(first, first + 20)
			// 绘制地址
			let numSpace = ((i + 1) * 6 + 10) / 100
			markctx.fillText(str, textToWidth, data.cheight * numSpace);
			first += 20
		}
		// 绘制地址
		// markctx.fillText(data.address, textToWidth, textToHeight2);

		markctx.draw(false, () => {
			setTimeout(() => { // 保证第一张图片渲染正常 -- 定时300有时候也会不正常（多测试）--至少400
				uni.canvasToTempFilePath({
					canvasId: 'firstCanvas',
					success(res) {
						fileList.value.push({
							url: res.tempFilePath
						})
						emit('onBack', fileList.value)
						uni.hideLoading()
						saveImg(res.tempFilePath)
					},
					fail(err) {
						uni.hideLoading()
						console.log('合成失败', err);
					}
				}, ctx)
			}, 300)
		})
	}


	// 用户不允许使用摄像头时触发
	function error(e) {
		// uni.showToast({
		// 	title: e.detail.errMsg,
		// 	icon: 'none'
		// })
	}
</script>

<style lang="scss" scoped>
	.waterMark-center {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 32%;
		width: 750rpx;
	}

	.waterMark {
		width: 750rpx;
		box-sizing: border-box;
		padding: 30rpx;
		color: #EEEEEE;
		font-size: 34rpx;

		.dec {
			width: 100%;
			white-space: pre-wrap;
			margin-bottom: 15rpx;
		}
	}

	.cameraBtn {
		width: 120rpx;
		height: 120rpx;
		line-height: 120rpx;
		border: 6rpx #FFFFFF solid;
		border-radius: 50%;
		padding: 8rpx;
		position: absolute;
		left: calc(50% - 60rpx);
		bottom: 210rpx;

		&-inner {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background-color: #FFFFFF;
			text-align: center;
			color: #007AFF;
		}
	}

	.rotate {
		width: 52rpx;
		height: auto;
		position: absolute;
		right: 44rpx;
		bottom: 580rpx;
	}

	.lights {
		width: 40rpx;
		height: auto;
		position: absolute;
		right: 50rpx;
		bottom: 450rpx;
	}

	.bottomBtn {
		width: 100%;
		height: 150rpx;
		padding-bottom: 15rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		text-align: center;
		display: flex;
		justify-content: space-between;

		.btn {
			width: 30%;
			height: 150rpx;
			font-size: 34rpx;
			color: #FFFFFF;
			line-height: 150rpx;
		}
	}

	.bottomBg {
		width: 100%;
		height: 170rpx;
		box-sizing: border-box;
		padding: 20rpx 30rpx 40rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .8);
		display: flex;
		justify-content: space-between;
		align-items: center;

		.imgBox {
			width: 110rpx;
			height: 110rpx;
			float: left;
			margin-right: 40rpx;
			position: relative;

			.cu-tag {
				position: absolute;
				right: 0;
				top: 0;
				border-bottom-left-radius: 2px;
				padding: 3px 5px;
				height: auto;
				background-color: rgba(0, 0, 0, 0.5);
				font-size: 10px;
				vertical-align: middle;
				font-family: Helvetica Neue, Helvetica, sans-serif;
				white-space: nowrap;
				color: #ffffff;
			}
		}

		.imgItem {
			width: 110rpx;
			height: 110rpx;
		}
	}

	.iconClose {
		width: 20rpx;
		height: 20rpx;
	}
</style>