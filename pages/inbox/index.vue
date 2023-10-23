<template>
	<view class="inbox">
		<uni-easyinput style="padding: 16px 10px;box-sizing: border-box;" prefixIcon="search" placeholder="search"></uni-easyinput>
			<view>
				<view v-if="messageList.length > 0">
					<uni-list>
						<uni-list :border="true">
							<view v-for="(item,index) in messageList" :key="index">
								<label style="display: flex;align-items: center;">
									<checkbox v-if="delShow" @click="isChecked(item.FromId,item.ToId,item.checked)"
										:checked="item.checked" style="padding-left: 20px;" />
									<view style="flex: 1;overflow: hidden;">
										<uni-list-chat :clickable="true" :avatar-circle="true" :title="item.NickName"
											:avatar="item.img" :note="item.Content" badge-positon="left"
											:badge-text="item.UnreadCount" @click="messageClick(item)">
											<view class="chat-custom-right">
												<text class="chat-custom-text">{{item.InsertTime}}</text>
												<uni-icons type="right" color="#999" size="18"></uni-icons>
											</view>
										</uni-list-chat>
									</view>
								</label>
							</view>
						</uni-list>
					</uni-list>
					<uni-load-more v-if="moreStatus.showloading" :status="moreStatus.status"></uni-load-more>
				</view>
				<view v-else>
					<h3 style="text-align: center;margin-top: 100px;">Not Data</h3>
					<!-- <u-empty text="Not Data" icon="/static/inbox/message.png" /> -->
				</view>
			</view>
		
	</view>
	</template>

<script setup>
	import { reactive, toRefs, getCurrentInstance } from 'vue'
	let data = reactive({
		messageList: [{
			FromId: 1,
			ToId:2,
			ToName: 'Na zi',
			img: 'https://picx.zhimg.com/v2-e247008b499a5bbcc57c4f9dd1318435_r.jpg?source=1940ef5c',
			Content: 'hello',
			UnreadCount: 2,
			InsertTime: '2023-7-1'
		},{
			FromId: 1,
			ToId:3,
			ToName: 'Lucy',
			img: 'https://img1.baidu.com/it/u=172615015,3544592209&fm=253&fmt=auto&app=120&f=JPEG?w=1176&h=800',
			Content: 'hello',
			UnreadCount: 2,
			InsertTime: '2023-7-1'
		}],
		moreStatus: {
			showloading: false,
			status: 'noMore'
		},
		delShow: false
	})
	
	const { messageList,moreStatus,delShow } = toRefs(data)
	
	// 跳转消息页面
	function messageClick(e) {
		uni.navigateTo({
			url: `/pages/inbox/chat/index?FromId=${e.FromId}&ToId=${e.ToId}&Avatar=${e.img}&ToName=${e.ToName}`
		})
	}
</script>

<style lang="scss" scoped>
	.inbox{
		padding: 10px;
	}
</style>