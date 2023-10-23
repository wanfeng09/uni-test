<template>
	<view class="contain">
		<ChatPage v-model="messageList"></ChatPage>
		<view class="sendBottom">
			<view class="input-bg">
				<input type="text" :adjust-position="false" v-model="customerMsg" :placeholder-style="placeholderStyle"
					placeholder="Content" />
			</view>
			<button class="btn" @click="sendMsg">Send</button>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from 'vue'
	import {
		onLoad,
		onHide
	} from '@dcloudio/uni-app'
	import { getChatInfo } from '@/common/api/inbox/chat.js'
	const messageList = reactive([{
			flag: false, // 左右位置
			isImg: false, // 判断图片
			Content: 'moring', // 信息内容
			showDate: false, // 时间
			showBubble: true, // 小尾巴
			InsertTime: '2023-2-2'
		},
		{
			flag: true, // 左右位置
			isImg: false, // 判断图片
			Content: 'moring', // 信息内容
			showDate: true, // 时间
			showBubble: true, // 小尾巴
			InsertTime: '2023-2-2'
		},
	])
	let customerMsg = ref('')
	const placeholderStyle = ref('color:#8a8a8f;font-size:17px')

	onHide(() => {
		// 关闭 WebSocket 连接
		uni.closeSocket()
	})

	let getOptions = reactive({})

	onLoad((options) => {
		getMsgList()
		init() // 创建WebSocket连接
		if (JSON.stringify(options) !== '{}') {
			getOptions = options
		}
	})
	function getMsgList(){
		getChatInfo().then(res => {
			console.log(res);
		})
	}

	// 创建WebSocket连接
	function init() {
		uni.connectSocket({
			url: 'ws://localhost:6868/',
			method: 'GET'
		});
	}

	let socketOpen = ref(false); // 判断服务器是否开启
	let socketMsgQueue = reactive([]);


	// 监听服务器返回信息
	uni.onSocketMessage(function(res) {
		console.log('收到服务器内容：' + res.data);
	});

	// 监听WebSocket连接打开事件。
	uni.onSocketOpen(function(res) {
		socketOpen.value = true;
		for (var i = 0; i < socketMsgQueue.length; i++) {
			sendSocketMessage(socketMsgQueue[i]);
		}
		socketMsgQueue = [];
	});

	function sendMsg() {
		if(customerMsg.value){
			if (socketOpen.value) {
				let obj = {
					FromId: getOptions.FromId,
					ToId: getOptions.ToId,
					Content: customerMsg.value,
					Username: 'Hui',
					ToUsername: getOptions.ToName
				}
				uni.sendSocketMessage({
					data: JSON.stringify(obj),
					success() {
						customerMsg.value = ''
					}
				});
			} else {
				socketMsgQueue.push(customerMsg.value);
				uni.showToast({
					title: '服务器崩溃，请联系客服',
					icon: 'none'
				})
			}
		}else{
			uni.showToast({
				title: '请输入发送内容',
				icon: 'none'
			})
		}
		
	}
</script>

<style lang="scss" scoped>
	.contain {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;

		.sendBottom {
			border-top: 1px solid #c8c7cc;
			box-sizing: border-box;
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			padding: 16px 20px;
			position: absolute;
			bottom: 10px;
			z-index: 99;
			background: #fff;

			.input-bg {
				flex: 1;
				background-color: #efeff4;
				padding: 10px;
				margin-right: 10px;
				border-radius: 4px;
			}

			.btn {
				font-size: 16px;
				background-color: #7b6bff;
				color: #fff;
			}
		}
	}
</style>