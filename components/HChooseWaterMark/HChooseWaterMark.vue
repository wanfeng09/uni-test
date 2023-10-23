<template>
	<view>
		<canvas :style="{ width: canvas.cwidth + 'px', height: canvas.cheight + 'px', position: 'absolute', top: '-999999999px'}" canvas-id="firstCanvas"></canvas>
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
			<view @tap="ifAddImg" v-if="modelValue.length < limit" class="H-flex H-flex-column H-bg-gray"
				style="width: 210rpx;height: 210rpx;overflow: hidden;margin: 10rpx;font-size: 0;position: relative">
				<text style="font-size: 80rpx;height: 80rpx;line-height: 80rpx;margin-bottom: 20rpx;display: block;">
					+ </text>
				<text style="font-size: 26rpx;line-height: 36rpx;text-align: center;display: block;">添加照片</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive, getCurrentInstance } from 'vue';
	let { ctx } = getCurrentInstance()
	const props = defineProps({
		modelValue: {
			type: Array,
			required: true,
			default: function() { return []}
		},
		limit: {
			type: Number,
			default: 6
		},
		sourceType: {
			type: Array,
			default: function() { return ['album', 'camera']; }
		},
		disable:  {
			type: Boolean,
			default: false
		},
	})

	let LocationFlag = ref(false)

	let canvas = reactive({
		device: 'back', //前置或后置摄像头，值为front, back
		flash: 'off', // 闪光灯，值为auto, on, off
		nowDate: '',
		address: '', //当前地址信息
		cwidth: 100, // canvas 元素宽度
		cheight: 100 ,// canvas 元素高度
		windowWidth: 390,
		windowHeight: 753,
	})
	
	// 获取系统信息，为 camera 组件设置高度
	uni.getSystemInfo({
		success: function(res) {
			canvas.windowWidth = res.windowWidth
			canvas.windowHeight = res.windowHeight
		}
	});
	
	// 获取当前地址
	function getLocation() {
		canvas.address = '广东省广州市白云区测地址'
		LocationFlag.value = true
	}
	
	getLocation()
	
	const emit = defineEmits(['update:modelValue'])
	
	// 判断地址是否解析完成
	function ifAddImg(){
		if(props.disable) return;
		if(LocationFlag.value){
			addImg()
		}else{
			uni.showToast({
				title: '位置解析失败，请重试！',
				icon: 'none'
			})
		}
	}
	
	let originArr = [...props.modelValue]
	// 添加图片
	function addImg() {
		let num = props.limit - props.modelValue.length;
		if (num < 1) { return false; }
		uni.chooseImage({
			count: num,
			sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
			sourceType: props.sourceType,
			success: (res) => {
				uni.showLoading({
					mask: true,
					title: '上传中，请稍等...'
				})
				if (props.modelValue.length >= props.limit) { return; }
				originArr = [...props.modelValue]
				drawWaterMark(0,res.tempFilePaths)
			}
		});
	}

	// 画水印 【递归】
	function drawWaterMark(params,list) {
		if(list && params < list.length){
				uni.getImageInfo({
					src: list[params],
					success(imgRes) {
						canvas.nowDate = new Date() // 实时
						console.log('图片高度',imgRes);
						// 求缩放比
						let diff  = Math.floor(imgRes.width / canvas.windowWidth)
						if(imgRes.width > canvas.windowWidth){
							canvas.cwidth = imgRes.width / diff
							canvas.cheight = imgRes.height / diff
						}else{
							canvas.cwidth = imgRes.width
							canvas.cheight = imgRes.height
						}
						
						let markctx = uni.createCanvasContext('firstCanvas', ctx)
						markctx.drawImage(imgRes.path, 0, 0, canvas.cwidth, canvas.cheight);
						markctx.setFillStyle('#fff'); // 设置颜色为白色
						// 设置字体大小
						markctx.setFontSize(14); 
						markctx.setTextAlign('right'); // 设置字体位置
						markctx.setTextBaseline('top') // 用于设置文字的水平对齐
						// 初始地址宽度
						let addressWidth = markctx.measureText(canvas.address.substring(0, 10)).width // 需写在setFontSize后面，否则计算错误
						// 求取一个字符宽度
						let strWidth = Math.floor(addressWidth / 10)  
						// 字符个数
						let strLength = Math.floor((canvas.cwidth - 20) / strWidth) - 2   
						// 行数高度
						let rowHeightText = 18
						// 行数 【地址长度 / 字符个数】
						let ifPoint = canvas.address.length / strLength
						let addressRow = null
						if(String(ifPoint).indexOf('.') > -1){
							addressRow = Math.floor(ifPoint)
						}else{
							addressRow = ifPoint - 1
						}
						// 底层距离
						let bottomHeight = canvas.cheight - 30
						// 时间y
						let textToHeight1 = bottomHeight - (addressRow + 1) * rowHeightText; // 绘制文本的右下角y坐标位置
						
						// 绘制日期和时间
						markctx.fillText(canvas.nowDate, canvas.cwidth - 26, textToHeight1 - 10);
						
						let first = 0
						for (var i = 0; i < canvas.address.length; i++) {
							if (first > canvas.address.length) {
								break
							}
							let str = canvas.address.substring(first, first + strLength)
							// 绘制地址
							let numSpace = (addressRow - i) * rowHeightText
							markctx.fillText(str, canvas.cwidth - 26, bottomHeight - numSpace);
							first += strLength
						}
						
						markctx.draw(false, () => {
							setTimeout(() => { // 保证第一张图片渲染正常 -- 定时300有时候也会不正常（多测试）--至少400
								uni.canvasToTempFilePath({
									canvasId: 'firstCanvas',
									success(res) {
										originArr.push({
											url: res.tempFilePath,
											data: res.tempFilePath,
										});
										drawWaterMark(params + 1 ,list)
									},
									fail(err) {
										console.log('合成失败', err);
									}
								}, ctx)
							}, 300)
						})
					},
					fail(err) {
						uni.showToast({
							title: '图片类型不支持上传',
							icon: 'none'
						})
						setTimeout(() => {
							drawWaterMark(params + 1 ,list)
						},1500)
					}
				})
		}else{
			emit('update:modelValue', originArr)
			uni.hideLoading()
			console.log('循环完毕');
		}
	}
	
	// 保存水印
	function saveImg(path) {
		// 已经授权
		uni.saveImageToPhotosAlbum({
			filePath: path,
			complete(res) {
				// console.log('保存图片', res);
			}
		})
	}

	// 删除图片事件
	function removeImg(index) {
		let originArr = [...props.modelValue]
		originArr.splice(index, 1);
		emit('update:modelValue', originArr)
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