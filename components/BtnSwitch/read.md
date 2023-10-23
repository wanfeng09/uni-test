```html
	<BtnSwitch v-model="btnList" :disabled="false"></BtnSwitch>
```

```js
	import { reactive } from "vue";
	const btnList = reactive([{
			title: 'any',
			active: false,
		}, {
			title: '111',
			active: true,
		},{
			title: 'none',
			active: false,
		}])
```

### UploadImg Props

|属性名			|类型	| 默认值|说明	| 是否必填	| 
|:-:			|:-:	|:-:	|:-:	|:-:	|
|modelValue		|Array	| [] | 数组 | 是 |
|disabled	|Boolean	| false | 是否禁用 | 否

##### modelValue 数组对象属性
|属性名			|类型	| 默认值|说明	| 
|:-:			|:-:	|:-:	|:-:	|
|title		|String	| 'title'| 标题 
|active	|Boolean	|	false	| 是否激活
