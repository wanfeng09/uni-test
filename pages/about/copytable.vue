<template>
	<view class="container">
		<!-- <button class="uni-button" size="mini" type="primary" @click="downloadtable">download</button> -->
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th width="80" sortable @sort-change="idSortChange">ID</uni-th>
					<uni-th width="150" sortable align="center" @sort-change="dateSortChange">日期</uni-th>
					<uni-th width="150" align="center">姓名</uni-th>
					<uni-th align="center">地址</uni-th>
					<uni-th width="204" align="center">设置</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td>{{ item.id }}</uni-td>
					<uni-td>{{ item.date }}</uni-td>
					<uni-td>
						<view class="name">{{ item.name }}</view>
					</uni-td>
					<uni-td align="center">{{ item.address }}</uni-td>
					<uni-td>
						<view class="uni-group">
							<button class="uni-button" size="mini" type="primary" @click="copyClick(item)">复制</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<!-- <view class="uni-pagination-box"><uni-pagination show-icon :page-size="pageSize" :current="pageCurrent"
					:total="total" @change="paginationChange" /></view> -->
		</view>
		<view style="margin: 20px 0;">
			<button class="uni-button" size="mini" type="warn" @click="getCopyClick">粘贴</button>
			<view class="copyContent">
				{{copyContent}}
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		reactive,
		ref
	} from "vue";
	import {
		onLoad
	} from '@dcloudio/uni-app'
	const tableData = reactive([{
			id: 1,
			date: '2020-1-1',
			name: '格雷',
			address: "aaa"
		},
		{
			id: 8,
			date: '2023-6-22',
			name: '张阿三',
			address: "abc"
		},
		{
			id: 3,
			date: '2019-10-1',
			name: '王五',
			address: "aaa"
		},
		{
			id: 6,
			date: '2022-3-1',
			name: '小名',
			address: "abcd"
		},
		{
			id: 9,
			date: '2020-11-1',
			name: '露西',
			address: "abc"
		},
		{
			id: 2,
			date: '2020-11-1',
			name: '纳兹',
			address: "aghj"
		}
	])
	let pageSize = ref(10)
	let pageCurrent = ref(1)
	let total = ref(0)
	let loading = ref(false)
	let copyContent = ref('copy Content')

	onLoad(() => {})
	// // 多选
	function selectionChange(e) {
		console.log(e.detail.index)
	}
	// // 分页触发
	function paginationChange(e) {
		console.log(e);
	}
	// 复制行数据
	function copyClick(evt) {
		uni.setClipboardData({
			data: JSON.stringify(evt),
			success(result) {}
		})
	}
	// 获取行数据
	function getCopyClick() {
		uni.getClipboardData({
			success: function(res) {
				copyContent.value = res.data
			}
		});
	}

	function idSortChange(evt) {
		if (evt.order === 'descending') {
			tableData.sort((a, b) => {
				return b.id - a.id
			})
		} else if (evt.order === 'ascending') {
			tableData.sort((a, b) => {
				return a.id - b.id
			})
		}
	}

	function dateSortChange(evt) {
		// getTime() 根据时间对象来拿取 Date.parse()根据日期格式直接获取
		// let val1 = Math.floor(new Date(a.date).getTime() / 1000)
		// let val2 = Math.floor(new Date(b.date).getTime() / 1000)
		if (evt.order === 'descending') {
			tableData.sort((a, b) => {
				if (Date.parse(a.date) === Date.parse(b.date)) {
					return a.id - b.id // 权重2
				}
				return Date.parse(b.date) - Date.parse(a.date) // 权重1【max】
			})
		} else if (evt.order === 'ascending') {
			tableData.sort((a, b) => {
				if (Date.parse(a.date) === Date.parse(b.date)) {
					return a.id - b.id
				}
				return Date.parse(a.date) - Date.parse(b.date)
			})
		}
	}

	function downloadtable() {

	}
</script>
<style scoped>
	.container {
		padding: 20px;
	}

	.uni-group {
		display: flex;
		align-items: center;
	}

	.copyContent {
		margin-top: 10px;
		min-height: 100px;
		padding: 10px;
		background-color: antiquewhite;
	}
</style>