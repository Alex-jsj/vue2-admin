<template>
	<div id="multiple-image-upload" :class="isMobile ? 'mobile' : ''">
		<el-upload
			:action="ajax_address"
			list-type="picture-card"
			:before-upload="beforeAvatarUpload"
			:on-preview="handlePictureCardPreview"
			:on-remove="handleRemove"
			:http-request="handleUpload"
			:file-list="fileList"
			:multiple="true"
		>
			<i class="el-icon-plus"></i>
			<!-- <el-button size="small" type="primary">点击上传</el-button> -->
		</el-upload>
		<el-dialog :visible.sync="dialogVisible" title="图片预览">
			<img style="width:100%;" :src="dialogImageUrl" />
		</el-dialog>
		<div v-if="imagesValue.length > 1">
			<el-link type="primary">拖动下方文件名进行排序</el-link>
			<vuedraggable v-model="imagesValue" draggable=".draggable-item" @start="onDragStart" @end="onDragEnd" class="draggable-item-box">
				<!-- 拖拽元素 -->
				<el-tag type="info" size="small" v-for="(item, index) in imagesValue" :key="index" class="draggable-item">{{ item.name }}</el-tag>
			</vuedraggable>
		</div>
	</div>
</template>

<script>
/* 拖拽排序组件 */
import vuedraggable from 'vuedraggable';
/* vuex */
import { mapState } from 'vuex';
export default {
	// 多图上传组件
	name: 'multiple-image-upload',
	data() {
		return {
			dialogImageUrl: '',
			dialogVisible: false,
			fileList: []
		};
	},
	props: {
		ajax_address: {
			type: String,
			default: ''
		},
		images: {
			type: Array,
			default: () => []
		}
	},
	model: {
		prop: 'images',
		event: 'change'
	},
	computed: {
		...mapState(['isMobile', 'token_field']),
		// 定义一个计算属性,给子组件的 v-model使用
		imagesValue: {
			// 计算属性的 get 返回父组件传入的 value,即model,props中定义的 prop
			get: function() {
				return this.images;
			},
			set: function(value) {
				//向父组件触发事件,此事件为model中定义的event,子组件v-model绑定了该计算属性,输入时会触发计算属性的set方法,即向父组件触发该事件
				this.$emit('change', value);
			}
		}
	},
	components: { vuedraggable },
	watch: {
		imagesValue: function(newVal) {
			this.fileList = [];
			let arr = [];
			newVal.map(item => {
				arr.push({
					name: item.name,
					url: item.thumbnailUrl
				});
			});
			this.fileList = arr;
		}
	},
	methods: {
		// 移除上传的文件
		handleRemove(file, fileList) {
			let index;
			this.imagesValue.map((e, i) => {
				if (e.thumbnailUrl === file.url) {
					index = i;
				}
			});
			this.imagesValue.splice(index, 1);
		},
		// 上传图片预览
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// 自定义上传
		handleUpload: function(param) {
			let fd = new FormData(); //通过form数据格式来传
			fd.append('file', param.file); //传文件
			this.$http({
				method: 'post',
				url: this.ajax_address,
				data: fd,
				headers: {
					'X-Access-Token': `${localStorage.getItem(this.token_field)}`
				},
				onUploadProgress: progressEvent => {
					let percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
					//调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
					param.onProgress({ percent: percent });
				}
			})
				.then(res => {
					if (res.code === 200) {
						const respon = res.result || '';
						Object.assign(respon, { name: param.file.name });
						this.imagesValue.push(respon);
						param.onSuccess();
					} else {
						this.$message.error('上传失败');
						param.onError();
					}
				})
				.catch(err => {
					console.log(err);
					param.onError();
				});
		},
		// 上传限制
		beforeAvatarUpload(file) {
			const reg = /\s/;
			const hasSpace = reg.test(file.name); // 是否有空格
			const isInSize = file.size / 1024 / 1024 < 300;
			const isAccept =
				file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/bmp' || file.type === 'image/tiff';
			if (hasSpace) {
				this.$message.error('文件名中不能含有空格!');
			}
			if (!isInSize) {
				this.$message.error('上传图片大小不能超过 300MB!');
			}
			if (!isAccept) {
				this.$message.error('只能上传 jpeg, jpg, png, bmp, tif 文件!');
			}
			return isInSize && isAccept && !hasSpace;
		},
		onDragStart: function(e) {
			// console.log(this.list);
		},
		onDragEnd: function(e) {
			// console.log(this.list);
		}
	}
};
</script>
<style lang="less">
.el-upload-list__item {
	transition: none;
}
.el-upload-list--picture-card .el-upload-list__item-actions {
	transition: none;
}
.draggable-item-box {
	border: 1px solid #ccc;
	.draggable-item {
		display: block;
		margin: 5px;
		cursor: all-scroll;
	}
}
</style>
