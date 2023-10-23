<template>
	<view class="chatBox">
		<view v-for="(item,index) in modelValue" :key="index" :id="'to'+index">
			<view :class="{'textPosition': item.flag}">
				<!-- 图片信息 -->
				<view v-if="item.isImg" style="margin: 0 16px;">
					<image :src="item.Content" mode="aspectFill" class="cover"
						@click="previewImg(item.Content)">
					</image>
				</view>
				<!-- 文字信息 -->
				<view v-else style="margin: 10px 16px;" class="message"
					:class="{'active-left': !item.flag,'active-right': item.flag }">
					{{item.Content}}
					<!-- 气泡 -->
					<view v-if="item.showBubble" class="message-arrow"
						:class="{'arrow-left': !item.flag,'arrow-right': item.flag }" />
				</view>
			</view>
			<!-- 时间 -->
			<view :class="{'dateTimePosition': item.flag }"
				style="font-size: 11px;color: rgb(133, 142, 153);padding: 5px 16px;" v-if="item.showDate">
				{{item.InsertTime}}
			</view>
		</view>
	</view>
</template>

<script setup>
	defineProps({
		modelValue: {
			type: Array,
			required: true,
			default: () => {}
		}
	})
</script>

<style lang="scss" scoped>
	$leftbg: #efeff4;
	$rightbg: #7b6bff;
	$lefttcolor: #000;
	$righttcolor: #fff;
	$imgbg: #c8c7cc;
	.chatBox {
		word-break: break-word;
		box-sizing: border-box;
		.cover {
			width: 100px;
			height: 100px;
			border-radius: 10px;
			background: $imgbg;
		}
		.textPosition {
			display: flex;
			justify-content: flex-end;
			text-align: right;
			align-items: center;
		}
		.message {
			position: relative;
			border-radius: 20px;
			padding: 10px;
			width: fit-content;
			font-size: 15px;
	
			&-arrow {
				position: absolute;
				bottom: 12px;
				width: 0;
				height: 0;
				font-size: 0;
				border: solid 8px;
			}
		}
		.active-left {
			min-height: 20px;
			background: $leftbg;
			color: $lefttcolor;
		}
		.active-right {
			min-height: 20px;
			background: $rightbg;
			color: $righttcolor;
		}
		.arrow-left {
			left: -14px;
			border-color: transparent $leftbg transparent transparent;
		}
		.arrow-right {
			right: -14px;
			border-color: transparent transparent transparent $rightbg;
		}
		.dateTimePosition {
			text-align: right;
		}
	}
</style>