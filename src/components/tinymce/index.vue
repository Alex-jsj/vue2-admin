<template>
    <div class="tinymce-box">
        <editor v-model="myValue" :id="id" :init="init" :disabled="disabled" @onClick="onClick"></editor>
        <div class="editor-custom-btn-container">
            <editorImage class="editor-upload-btn" @successCBK="imageSuccessCBK" />
        </div>
    </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'; //tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/themes/silver/theme';
import plugin from './plugin';
import toolbar from './toolbar';
// 图片上传
import editorImage from './component/imgUpload';
export default {
	name: 'tinymce',
	props: {
		value: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		id: {
			type: String,
			default: function() {
				return (
					'vue-tinymce-' +
					+Number(new Date()) +
					String((Math.random() * 1000).toFixed(0))
				);
			}
		}
	},
	data() {
		return {
			myValue: this.value,
			init: {
				selector: `#${this.id}`,
				language_url: './tinymce/langs/zh_CN.js', // 语言文件
				language: 'zh_CN', // 语言
				skin_url: './tinymce/skins/ui/oxide', // 皮肤
				// skin_url: 'tinymce/skins/ui/oxide-dark',//暗色系
				height: 500, // 编辑器高度
				plugins: plugin, // 插件
				toolbar: toolbar, // 工具条
				branding: false,
				paste_data_images: true, // 允许粘贴图像
				menubar: 'file edit insert view format table', // 最顶部工具文字
				autosave_interval: '30s', // 30s自动保存一次草稿
				autosave_ask_before_unload: true, // 设置编辑器是否应该在尝试关闭当前窗口时提示用户建议他们有未保存的更改
				autosave_restore_when_empty: true, // 可以指定当编辑器在初始化时为空时，TinyMCE是否应自动恢复存储在本地存储中的内容。
				// 此处为图片上传处理函数(功能太少，选择使用自定义的图片上传)
				// 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
				images_upload_handler: (blobInfo, success, failure) => {
					// const img = "data:image/jpeg;base64," + blobInfo.base64();
					// success(img);
				}
			}
		};
	},
	watch: {
		value(newValue) {
			this.myValue = newValue;
		},
		myValue(newValue) {
			this.$emit('input', newValue);
		}
	},
	components: {
		Editor,
		editorImage
	},
	mounted() {
		tinymce.init({});
	},
	methods: {
		// 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
		// 需要什么事件可以自己增加
		onClick(e) {
			this.$emit('onClick', e, tinymce);
		},
		// 可以添加一些自己的自定义事件，如清空内容
		clear() {
			this.myValue = '';
		},
		imageSuccessCBK(arr) {
			arr.forEach(v => {
				tinymce
					.get(this.id)
					.execCommand(
						'mceInsertContent',
						false,
						`<img class="wscnph" src="${v}" >`
					);
			});
		}
	}
};
</script>
<style scoped>
.editor-custom-btn-container {
	position: absolute;
	right: 4px;
	top: 4px;
	/*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
	z-index: 10000;
	position: fixed;
}
.editor-upload-btn {
	display: inline-block;
}
</style>
