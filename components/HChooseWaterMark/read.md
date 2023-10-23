```html
	<HChooseWaterMark v-model="fileList"></HChooseWaterMark>
```

```js
	import { ref } from "vue";
	let fileList = ref([])
```

### Props

|属性名			|类型	| 默认值|说明	| 是否必填	| 
|:-:			|:-:	|:-:	|:-:	|:-:	|
|modelValue		|Array	| [] | 数组 | 是 |
|limit	|Boolean	| 6 | 图片限制 | 否
|sourceType |Array	| ['album', 'camera'] | album 从相册选图，camera 使用相机，默认二者都有 | 否 |


