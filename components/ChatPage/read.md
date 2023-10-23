```html
	<ChatPage v-model="messageList"></ChatPage>
```

```js
	import { reactive } from "vue";
	const messageList = reactive([
		{
			flag: false, // 左右位置
			isImg: false, // 判断图片
			Content: 'moring', // 信息内容
			showDate: false, // 是否显示时间
			showBubble: true, // 小尾巴
			InsertTime: '2023-2-2' // 时间
		},
		{
			flag: true, 
			isImg: false,
			Content: 'moring', 
			showDate: true, 
			showBubble: true, 
			InsertTime: '2023-2-2'
		},
	])
```

### Array 数组对象属性

|属性名			|类型	| 默认值|说明	| 是否必填	| 
|:-:			|:-:	|:-:	|:-:	|:-:	|
|flag		|Boolean	| false | 左右位置 | 是 |
|isImg	|Boolean	| false | 判断图片 | 是
|Content|String	| '' | 发送内容 | 是
|InsertTime|String	| '' |发送时间 | 是
|showDate|Boolean	| false | 是否显示时间 | 是
|showBubble|Boolean	| true | 气泡是否显示 | 是


