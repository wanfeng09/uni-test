<template>
	<view class="switch">
		<view class="border" :class="{active:item.active,disabled: disabled}"
			@click="selectBtn(index)" v-for="(item,index) in list" :key="index">
			{{item.title}}
		</view>
	</view>
</template>

<script setup>
import { reactive,computed,watch } from "vue";
	const props = defineProps({
		modelValue: {
			type: Array,
			required: true,
			default: () => {}
		},
		disabled: {
			type: Boolean,
			default: false
		},
	})
	
	const list = computed(() => {
		return props.modelValue
	})
	
	function selectBtn(i){
		if(!props.disabled){
			list.value.map((item,index) => {
				item.active = index === i
			})
		}
		
	}
</script>

<style lang="scss" scoped>
	$bg-color: green !default;
	$br-color: green !default;
	$font-color: #fff !default;
	
	.switch {
		display: flex;
		flex-direction: row;
		align-items: center;
		
		.border:not(:first-child,:last-child) {
			border-right: none;
			border-left: none;
		}
		.border:first-child{
			border-radius: 20px 0 0 20px;
		}
		
		.border:last-child{
			border-radius: 0 20px 20px 0;
		}

		.border {
			flex: 1;
			padding: 10px 0;
			text-align: center;
			border: 1px solid $br-color;
		}

		.active {
			background-color: $bg-color;
			color: $font-color
		}
		
		.disabled{
			color: rgba(0, 0, 0, 0.3);
			cursor: not-allowed;
			border: 1px solid rgba(0, 0, 0, 0.2);
		}

	}
</style>
