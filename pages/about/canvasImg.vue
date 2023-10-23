<template>
	<view class="">
		<!-- <canvas :style="{width: canvas.width + 'px',height: canvas.height+ 'px',position: 'absolute',top: '-99999px','zIndex': -1}" canvas-id="myCanvas" id="myCanvas"></canvas> -->
		<canvas :style="{width: canvas.width + 'px',height: canvas.height+ 'px'}" canvas-id="myCanvas"
			id="myCanvas"></canvas>
		<button @click="createCanvas">点击生成画布</button>
		<button @click="exportImg" style="margin-top: 30rpx;">导出图片</button>
	</view>
</template>

<script setup>
	import { reactive, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	let canvas = reactive({
		startHeight: 10,
		startWidth: 10,
		width: 300,
		height: 600,
		baseHeight: 190,
	})

	let user = ref({
		id: '1111111111111',
		name: '测试',
		phone: '13888888888',
	})

	onLoad(() => {
		uni.getSystemInfo({
			success: function(res) {
				canvas.width = res.windowWidth
				// if(res.osName === 'ios'){
				// }else{
				// }
			}
		});
	})

	// 创建画布
	function createCanvas() {
		uni.showLoading({
			mask: true
		})
		return new Promise((resolve, reject) => {
			const markctx = uni.createCanvasContext('myCanvas')
			markctx.setFillStyle('#f5f5f5'); // 设置颜色为白色
			markctx.rect(canvas.startWidth, canvas.startHeight, canvas.width - 20, canvas.height - 30)
			markctx.fillRect(canvas.startWidth, canvas.startHeight, canvas.width - 20, canvas.height - 30)
			markctx.save() // 保存上下文
			markctx.restore() // 恢复

			markctx.setFillStyle('#fff');
			// markctx.setStrokeStyle('#F2F2F2')
			markctx.setShadow(2, 0, 12, '#d3d3d3')
			markctx.fillRect(canvas.startWidth + 10, canvas.startHeight + 10, canvas.width - 40, canvas.baseHeight)
			// markctx.strokeRect(canvas.startWidth + 10, canvas.startHeight + 10, canvas.width - 40, canvas.baseHeight)
			markctx.save() // 保存上下文

			markctx.restore() // 恢复
			markctx.setFillStyle('#000');
			markctx.setFontSize(14)
			let firstHight = (canvas.baseHeight / 4) - 15 + canvas.startHeight
			markctx.fillText('订单号', canvas.startWidth + 20, firstHight);
			markctx.fillText('下单用户', canvas.startWidth + 20, firstHight + (canvas.baseHeight / 4))
			markctx.fillText('手机号', canvas.startWidth + 20, firstHight + ((canvas.baseHeight / 4) * 2))
			markctx.fillText('下单地址', canvas.startWidth + 20, firstHight + ((canvas.baseHeight / 4) * 3))

			let address = '广东省广州市------------------------'
			markctx.setTextAlign('right')
			markctx.fillText(user.value.id, canvas.width - 30, firstHight)
			markctx.fillText(user.value.name, canvas.width - 30, firstHight + ((canvas.baseHeight / 4)))
			markctx.fillText(user.value.phone, canvas.width - 30, firstHight + ((canvas.baseHeight / 4) * 2))
			// 画布换行
			let firststr = 0
			let addressNum = firstHight + ((canvas.baseHeight / 4) * 3)
			for (var i = 0; i < address.length; i++) {
				if (firststr > address.length) {
					break
				}
				let str = address.substring(firststr, firststr + 20)
				// 绘制地址
				let numSpace = i > 0 ? 22 : -15
				addressNum = addressNum + numSpace
				markctx.fillText(str, canvas.width - 30, addressNum)
				firststr += 20
			}

			markctx.save() // 保存上下文

			markctx.restore() // 恢复
			markctx.setTextAlign('left')

			let secondNum = 55

			markctx.fillText('test：', canvas.startWidth + 20, canvas.baseHeight + secondNum)

			markctx.fillText('test：', canvas.startWidth + 20, canvas.baseHeight + secondNum * 2)
			markctx.save() // 保存上下文
			markctx.restore() // 恢复
			markctx.setFillStyle('#EE0A25');
			markctx.setFontSize(14)
			markctx.fillText('fail', 100, canvas.baseHeight + secondNum)
			markctx.fillText('success', 100, canvas.baseHeight +
				secondNum * 2)

			markctx.save() // 保存上下文
			markctx.restore() // 恢复
			markctx.setFillStyle('#fff');
			markctx.setStrokeStyle('#F2F2F2')
			markctx.setShadow(2, 0, 12, '#d3d3d3')
			markctx.fillRect(canvas.startWidth + 10, canvas.baseHeight + secondNum * 2.4, canvas.width - 40, 100)
			markctx.strokeRect(canvas.startWidth + 10, canvas.baseHeight + secondNum * 2.4, canvas.width - 40, 100)

			markctx.save() // 保存上下文
			markctx.restore() // 恢复

			// 网络资源
			let imgurl =
				'https://img2.baidu.com/it/u=638285213,1746517464&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800'
			uni.getImageInfo({
				src: imgurl,
				success(res) {
					markctx.drawImage(res.path, 38, canvas.baseHeight + secondNum * 3, 40, 40)
					markctx.draw() // 注意这个，否则图片无法写入
				}
			})

			// 本地图片
			markctx.drawImage('/static/account/user.png', 100, canvas.baseHeight + secondNum * 3, 40, 40)

			setTimeout(() => {
				// markctx.draw() // 注意这个，否则图片无法写入
				uni.canvasToTempFilePath({
					canvasId: 'myCanvas',
					success(res) {
						uni.hideLoading()
						console.log(res);
						resolve(res.tempFilePath)
					},
					fail(err) {
						uni.hideLoading()
						reject('合成失败')
					}
				})
			}, 300)
		})

	}
	
	function exportImg(){
		createCanvas().then(res => {
			uni.saveImageToPhotosAlbum({
				filePath: res,
				complete(res) {
					// console.log('保存图片', res);
				}
			})
		})
	}
	
	
</script>

<style>

</style>