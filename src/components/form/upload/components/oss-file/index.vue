<template>
  <div :class="styles.oss">
    <el-image
      v-if="isUrlImg && path"
      ref="refImg"
      :src="path"
      :style="imgStyle"
      :preview-src-list="previewList"
      :initial-index="previewIndex"
      :fit="fit"
      :class="styles.image"
    >
      <template #error>
        <div class="el-image__error">
          {{ path ? '加载失败' : '加载中...' }}
        </div>
      </template>
    </el-image>
    <!--文件(非图片)-->
    <div v-else :class="styles.doc">
      <icon :name="isUrlVideo ? 'VideoPlay' : 'Document'" />
    </div>
    <div v-if="actionList.length" :class="styles.action">
      <icon
        v-for="item in actionList"
        :key="item.icon"
        :name="item.icon"
        :class="{ [styles.perspective]: item.icon === 'ZoomIn' && isUrlImg }"
        @click="item.click"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, computed, defineComponent, PropType } from 'vue-demi'
import { ElImage } from '@/components/element'
import { isImg, isVideo, messageLoading } from '@/utils'
import { formatOssUrl } from '@/utils/upload'
import { TypeOssFileState } from '@/types/oss-file.d'
import Icon from '@/components/icon/index.vue'
import styles from './index.module.scss'

export default defineComponent({
  name: 'BkOssFile',
  components: { ElImage, Icon },
  emits: ['edit', 'remove'],
  props: {
    url: {
      type: String,
      default: ''
    },
    // Boolean 是否展示操作栏; Array 操作栏可操作项, [preview, download, edit, remove]
    action: {
      type: [Array, Boolean],
      default: true
    },
    acl: {
      type: Boolean,
      default: false
    },
    imgStyle: {
      type: Object,
      default: () => ({
        width: '100px',
        height: '100px'
      })
    },
    // 文件列表, 用于预览整个列表, 不传只预览当前图片
    fileList: {
      type: Array as PropType<string[]>,
      readonly: true,
      default: () => []
    },
    // 图床配置
    process: {
      type: String,
      default: undefined
    },
    fit: {
      type: String as PropType<'' | 'fill' | 'none' | 'contain' | 'cover' | 'scale-down'>,
      default: 'contain'
    }
  },
  setup(props, { emit }): any {
    const refPreview = ref<any>(null)
    const refImg = ref<any>(null)

    const state = reactive<TypeOssFileState>({
      path: undefined,
      previewList: [],
      previewIndex: 0,
      actionMap: {
        preview: {
          icon: 'ZoomIn',
          click: handlePreview
        },
        download: {
          icon: 'Download',
          click: handleDownload
        },
        edit: {
          icon: 'Edit',
          click: () => handleAction('edit')
        },
        remove: {
          icon: 'Delete',
          click: () => handleAction('remove')
        }
      }
    })

    const { path, previewList, previewIndex } = toRefs(state)

    const isUrlImg = computed(() => isImg(props.url))

    const isUrlVideo = computed(() => isVideo(props.url))

    const actionList = computed(() => {
      const actions = (
        typeof props.action === 'boolean'
          ? props.action
            ? Object.keys(state.actionMap || {})
            : []
          : props.action
      ) as string[]

      return actions
        .filter(
          e => (e === 'download' ? isUrlImg.value : e) // 非图片不提供下载
        )
        .map(e => state.actionMap[e])
    })

    const formatPath = async (url?: string, process?: string) => {
      return formatOssUrl((url || props.url) as string, { acl: props.acl, process })
    }

    const initPreviewList = async () => {
      if (!isUrlImg.value) return
      const previewUrl = await formatPath(props.url)
      const isPreviewMultiple = props.fileList?.length // 是否预览列表

      // 获取预览图片地址, 预览时用原图
      state.previewList = isPreviewMultiple
        ? await Promise.all(
            props
              .fileList!.filter(e => isImg(e))
              .map((e: string) => (props.url!.startsWith(e) ? previewUrl : formatPath(e)))
          )
        : [previewUrl]

      const index = state.previewList.findIndex(e => e === previewUrl)
      state.previewIndex = ~index ? index : 0
    }

    async function handlePreview() {
      if (isUrlImg.value) {
        await initPreviewList()
        const trigger = refImg.value.$el.querySelector('img')
        trigger.click()
        return
      }
      handleDownload()
    }

    function handleDownload() {
      messageLoading('正在生成地址...', async () => {
        const url = await formatOssUrl(props.url as string, { acl: props.acl })
        window.open(url)
      })
    }

    async function handleAction(type: 'edit' | 'remove') {
      emit(type, props.url)
    }

    // 初始化
    ;(async () => {
      state.path = await formatPath(props.url, props.process)
    })()

    return {
      styles,
      refPreview,
      refImg,
      isUrlImg,
      isUrlVideo,
      actionList,
      previewList,
      previewIndex,
      path
    }
  }
})
</script>
