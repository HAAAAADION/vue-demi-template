<template>
  <div :class="styles.editor">
    <div
      v-loading="loading"
      :class="styles.container"
      :style="{ width: preview ? undefined : '100%' }"
    >
      <editor v-model="content" v-bind="attrs" :init="init" />
    </div>
    <template v-if="preview">
      <div :class="styles.phone">
        <img :src="previewBg" :class="styles.phoneBg" />
        <div v-html="content" :class="styles.content" />
      </div>
      <div :class="styles.recommend">
        <el-descriptions
          :column="1"
          :colon="false"
          :content-style="editorContentStyle"
          title="编辑器推荐"
        >
          <el-descriptions-item>
            <a href="https://xiumi.us/studio/v5#/paper/for/new/cube/0" target="blank">秀米编辑器</a>
          </el-descriptions-item>
          <el-descriptions-item>
            <a href="https://www.365editor.com/" target="blank">365编辑器</a>
          </el-descriptions-item>
          <el-descriptions-item>
            <a href="https://bj.96weixin.com/" target="blank">96编辑器</a>
          </el-descriptions-item>
          <el-descriptions-item>
            <a href="https://www.135editor.com/" target="blank">135编辑器</a>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          :column="1"
          :colon="false"
          :contentStyle="editorContentStyle"
          title="图片处理工具"
        >
          <el-descriptions-item>
            <a href="https://www.chuangkit.com/" target="blank">创可贴</a>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          :column="1"
          :colon="false"
          :contentStyle="editorContentStyle"
          title="图片编辑工具"
        >
          <el-descriptions-item>
            <a href="https://www.iloveimg.com/zh-cn" target="blank">ILOVEIMG</a>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, watch, defineComponent } from 'vue-demi'
import 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/themes/silver'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/link'
import 'tinymce/icons/default/icons'
import 'tinymce/models/dom/model'
import 'tinymce/plugins/fullscreen'
import 'tinymce/skins/ui/oxide/content.min.css'
import 'tinymce/skins/ui/oxide/content.inline.min.css'
import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/skins/ui/oxide/skin.shadowdom.min.css'
import { upload, filterOssURL, getOssConfig, multipleUpload, formatOssUrl } from '@/utils/upload'
import { messageLoading } from '@/utils'
import styles from './index.module.scss'

export default defineComponent({
  name: 'BkEditor',
  emits: ['update:modelValue', 'change'],
  components: { Editor },
  props: {
    modelValue: {
      type: null,
      default: undefined
    },
    preview: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { attrs, emit }): any {
    const state = reactive({
      content: props.modelValue,
      loading: false,
      editorContentStyle: {
        color: '#2E8FF4'
      },
      previewBg: '',
      init: {
        language_url: '/tinymce/zh-Hans.js',
        language: 'zh-Hans',
        height: 667,
        plugins: 'image media table wordcount fullscreen link',
        content_css: '/tinymce/content.min.css',
        paste_webkit_styles: 'all',
        // 可用 toolbar 配置: https://www.tiny.cloud/docs/tinymce/6/available-toolbar-buttons/
        toolbar: [
          'undo redo fullscreen | alignleft aligncenter alignright alignjustify | removeformat bold italic underline strikethrough forecolor backcolor | styleselect formatselect',
          'bullist numlist outdent indent | blockquote subscript superscript | link unlink openlink | image media table'
        ],
        branding: false,
        menubar: false,
        // 复制回调
        paste_preprocess: (plugin, args) => {
          replaceExternalResource(args.content, args)
        },
        // 图片上传回调
        images_upload_handler: async blob => {
          const res = await upload(blob.blob())
          return Promise.resolve(res?.url)
        }
      }
    })

    const { content, loading, editorContentStyle, previewBg, init } = toRefs(state)

    // 上传文件缓存
    const _cacheUrl = {}

    watch(
      () => props.modelValue,
      () => {
        state.content = props.modelValue
      }
    )

    watch(
      () => state.content,
      () => {
        emit('update:modelValue', state.content)
        emit('change', state.content)
      }
    )

    /**
     * 替换外部资源
     * @param   {String=}  content  自定义替换文本
     * @param   {Object=}  target   目前更新实例, 用于内部复制不需要接口上传时, 直接使用 this.content 更新会导致后续生命周期覆盖替换的文本
     * @return  {String}
     * */
    function replaceExternalResource(content, target) {
      return messageLoading('正在转存文件...', async () => {
        state.loading = true
        const res = await getOssConfig()
        const url = `${res.bucket}.${res.region}.aliyuncs.com`

        const regExp = new RegExp(`<img[^>]+src="((?:https?:)?\/\/(?!${url}).+?)"`, 'g')

        let useContent = content || state.content

        const imgList = [...useContent.matchAll(regExp)].reduce((res, item) => {
          return res.includes(item?.[1]) ? res : [...res, item?.[1]]
        }, [])

        const result = []

        // 如果文件已上传
        const unUploadList = imgList.reduce((res, url) => {
          if (_cacheUrl[url]) {
            result.push({ path: _cacheUrl[url], sourceUrl: url })
          } else {
            res.push(url)
          }
          return res
        }, [])

        // 如果存在没有上传过的文件, 则触发接口上传
        if (unUploadList.length) {
          try {
            const res = await multipleUpload(unUploadList)
            result.push(...(res.data || []))
          } catch (err) {
            /** */
          }
        }

        // 替换链接
        try {
          result.forEach((e, i) => {
            if (!e?.path) return

            const replaceUrl = filterOssURL(e.path)
            _cacheUrl[e.sourceUrl] = replaceUrl

            useContent = useContent.replace(
              new RegExp(`${e.sourceUrl.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')}`, 'g'),
              replaceUrl
            )
          })
        } catch (err) {
          /** */
        }

        if (unUploadList.length) {
          state.content = useContent
        } else if (target) {
          target.content = useContent
        }
        state.loading = false

        return useContent
      })
    }

    ;(async () => {
      if (props.preview) {
        state.previewBg = await formatOssUrl('public/phone.png')
      }
    })()

    return {
      styles,
      attrs,
      content,
      loading,
      previewBg,
      editorContentStyle,
      init
    }
  }
})
</script>
