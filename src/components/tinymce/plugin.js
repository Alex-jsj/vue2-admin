// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/

// import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/advlist";
import "tinymce/plugins/anchor";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autosave";
import "tinymce/plugins/code";
import "tinymce/plugins/codesample";
import "tinymce/plugins/directionality";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/hr";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/link"; // 插入链接
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/noneditable";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/paste";
import "tinymce/plugins/preview";
import "tinymce/plugins/print"; // 打印
import "tinymce/plugins/save";
import "tinymce/plugins/searchreplace"; // 搜索替换
import "tinymce/plugins/spellchecker"; // 拼写检查
import "tinymce/plugins/tabfocus";
import "tinymce/plugins/template"; // 插入模板
import "tinymce/plugins/textpattern";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";

const plugin = [
    "advlist anchor autolink autosave code codesample directionality fullscreen hr imagetools insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace tabfocus table template textpattern visualblocks visualchars wordcount"
];

export default plugin;
