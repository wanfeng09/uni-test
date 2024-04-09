<template>
	<view class="contain">
		<view class="box">
			<view v-for="(item, index) in modelValue" :key="index" :class="[
				'box-item',
				animateIndex == index ? 'active-animate' : '']">
				<view style="font-size: 0;">
					<image :src="item.imgurl" class="box-img" mode='aspectFill' v-if="index != 4"></image>
				</view>
				<view class="box-title" v-if="index != 4">{{item.title}}</view>
				<view class="box-btn" v-if="index == 4" @tap="go">{{item.title}}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	const props = defineProps({
		modelValue: {
			type: Array,
			required: true,
			default: function() { return []}
		},
		delay: { // 动画转圈速度
			type: Number,
			default: 100
		},
		circleNum: { // 动画转几圈
			type: Number,
			default: 3
		}
	})
	const emit = defineEmits(['update:modelValue'])
	// 动画 index
	let animateIndex = ref(-1)
	// 动画 执行状态 stop 停止 loading 执行中 end 结束
	let animateStatus = ref('stop')
	// 定时器
	let animateTimer = ref(0)
	// 开始抽奖
	function go() {
		// 判断用户是否抽过奖或者不满足条件，return
		// your code ...

		// 判断是否正在执行动画
		if (animateStatus.value != 'stop') { return false; }
		animateStatus.value = 'loading';

		// 算法可以是后端或前端（概率测试），决定抽奖结果

		// 随机数，出中奖号码
		let num = Math.floor(Math.random() * 8);
		// console.log("中奖数字",num);
		// num:4是抽奖按钮，即未中奖，指定其他数字
		if (num == 4) { num = 8; }
		// num 代表奖品的 index 应该使用自己的算法得出

		// 动画
		animate(num);
	}
	// 记录转圈次数（激活样式）
	let activeIndex = ref(0)

	function animate(num) {
		activeIndex.value = 0;
		animateIndex.value = 0;
		// 激活样式，即class="active-animate", 动画速度自定调整
		animateTimer.value = setInterval(() => { activeAnimateSpeed(num); }, props.delay);
	}
	function activeAnimateSpeed(num){
		// 顺时针奖品序号（即随机数num是7）
		let orders = [0, 1, 2, 5, 8, 7, 6, 3]; 
		// 奖品的位置（索引位置在5）
		let orderIndex = 0; 
		for(let i = 0; i < orders.length; i++){
		  if (orders[i] == num){
			orderIndex = i;
			break;
		  }
		}
		// console.log("奖品的位置",orderIndex);
		if (activeIndex.value >= 8 * props.circleNum + orderIndex){
		  clearInterval(animateTimer.value) ; 
		  // 动画结束
		  animateStatus.value = 'stop'; // 可以继续抽奖
		  // animateStatus.value = 'end'; // 结束抽奖
	
		  if(num == 8){
			uni.showToast({
			  title: '感谢参与 ^_^',
			  icon:"none"
			});
		  }else{
			uni.showToast({
			  title: '恭喜您！抽中了 : ' + props.modelValue[num].title,
			  icon: "none"
			});
		  }
		  // ...
		  return ;
		}
		activeIndex.value++;
		let index  = activeIndex.value % 8;
		animateIndex.value = orders[index];
	}
</script>

<style scoped>
	.contain {
		width: 630rpx;
		padding: 15rpx;
		border-radius: 10px;
		margin: 30rpx 60rpx;
		background-color: #fc2609;
		box-sizing: border-box;
	}

	.box {
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 600rpx;
		height: 630rpx;
		padding: 15rpx;
		background-color: #e86532;
		border-radius: 8px;
	}

	.box-item {
		width: 180rpx;
		height: 180rpx;
		background-color: rgba(255, 255, 255, 1);
		margin: 5rpx;
		border-radius: 5rpx;
		border-width: 8rpx;
		border-style: solid;
		border-color: #FFFFFF;
		overflow: hidden;
		box-sizing: border-box;
	}

	.box-img {
		width: 100rpx;
		height: 100rpx;
		margin: 8rpx 30rpx;
		overflow: hidden;
	}

	.box-title {
		line-height: 40rpx;
		height: 40rpx;
		overflow: hidden;
		text-align: center;
		color: #c88716;
		font-size: 22rpx;
	}

	.box-btn {
		color: #AB6120;
		background-color: #ffa527;
		font-weight: bold;
		height: 164rpx;
		line-height: 164rpx;
		text-align: center;
		font-size: 50rpx;
	}

	.active-animate {
		border-color: #0000ff;
	}
</style>