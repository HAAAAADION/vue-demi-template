<template>
  <div :class="{ [styles.upload]: true, [styles.disabled]: loading }">
    <div :style="{ height: imgStyle.height }" :class="styles.imgs">
      <oss-file
        v-for="(url, index) in modelValue"
        :key="url"
        :url="url"
        :acl="acl"
        :img-style="imgStyle"
        :file-list="modelValue"
        :action="action"
        :class="styles.img"
        process="image/resize,w_300"
        @edit="edit(index)"
        @remove="remove(index)"
      />
    </div>
    <el-upload
      v-if="!readonly"
      v-show="!modelValue.length || isMultiple"
      :multiple="isMultiple"
      :show-file-list="false"
      :http-request="beforeUpload"
      :accept="acceptText"
      :class="styles.uploader"
      :disabled="loading"
      action=""
      ref="uploadInput"
      key="upload"
    >
      <div :style="iconStyle" :class="styles.trigger">
        <template v-if="loading">上传中..</template>
        <icon v-else ref="refUploadHandler" name="Plus" :class="styles.icon" />
      </div>
    </el-upload>
  </div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, computed, defineComponent, PropType } from 'vue-demi'
import { UploadRequestOptions } from '@/types/upload.d'
import { upload } from '@/utils/upload'
import { isEmpty } from '@/utils'
import { ElUpload, ElMessage } from '@/components/element'
import Icon from '@/components/icon/index.vue'
import OssFile from './components/oss-file/index.vue'
import styles from './index.module.scss'

export default defineComponent({
  name: 'BkUpload',
  components: {
    ElUpload,
    OssFile,
    Icon
  },
  emits: ['update:modelValue', 'change'],
  props: {
    modelValue: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 业务类型
    service: {
      type: String,
      default: 'common'
    },
    // 最大上传数量
    max: {
      type: [String, Number],
      default: 1
    },
    // 尺寸
    imgStyle: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({
        width: '100px',
        height: '100px'
      })
    },
    // 上传是否开启私有访问
    acl: {
      type: Boolean,
      default: false
    },
    // 可上传类型, 传入 Array 会自动转成 String; example: image/png,image/gif
    accept: {
      type: [String, Array],
      default: undefined
    },
    // 是否开启拖拽
    drag: {
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default: undefined
    }
  },
  setup(props, { emit }): any {
    const refUploadHandler = ref<any>(null)

    const state = reactive({
      index: undefined as number | undefined,
      loading: false
    })

    const { loading } = toRefs(state)

    // 是否上传多张
    const isMultiple = computed(() => +props.max > 1)

    const iconStyle = computed(() => {
      const data = <Record<string, any>>{
        ...props.imgStyle,
        lineHeight: props.imgStyle.height
      }
      if (data.width === 'auto') data.width = data.height
      return data
    })

    // 上传额外请求头
    const headers = computed(() => {
      const result = {} as Record<string, any>

      // 是否开启私有访问
      if (props.acl) result['x-oss-object-acl'] = 'private'

      return result
    })

    // 支持上传格式
    const acceptText = computed(() =>
      typeof props.accept === 'string' ? props.accept : (props.accept || []).join(',')
    )

    const action = computed(() => {
      return props.readonly ? ['preview', 'download'] : true
    })

    const update = (val: string[]) => {
      emit('update:modelValue', val)
      emit('change', val)
    }

    const handleUpload = async (e: UploadRequestOptions) => {
      try {
        state.loading = true
        const res = await upload(e.file, {
          service: props.service,
          headers: headers.value
        })

        const list = [...props.modelValue]

        if (!isEmpty(state.index)) {
          // 修改
          list[state.index as number] = res!.name
          update(list)
          state.index = undefined
        } else {
          // 新增上传
          update(isMultiple.value ? list.concat(res!.name) : [res!.name])
        }
      } catch (error) {
        ElMessage.error('上传失败')
      }

      state.loading = false
    }

    const beforeUpload = (uploadFile: UploadRequestOptions) => {
      if (props.modelValue.length >= +props.max && isMultiple.value && state.index === undefined) {
        ElMessage.error(`最多上传${props.max}个资源文件`)
        return
      }

      if (props.size && uploadFile.file?.size > props.size) {
        ElMessage.error(`资源大小不能超过${props.size}`)
        return
      }

      if (props.accept) {
        const acceptList = Array.isArray(props.accept)
          ? props.accept
          : props.accept.split(',').map(e => e.trim())
        // TODO 支持匹配 *
        const isMatch = acceptList.some(e => e === uploadFile?.file?.type)

        if (!isMatch) {
          ElMessage.error('不能上传该格式文件')
          return
        }
      }

      handleUpload(uploadFile)
    }

    const edit = (idx: number) => {
      state.index = idx
      const evt = new Event('click', { bubbles: true, cancelable: false })
      return refUploadHandler.value?.$el?.parentNode?.dispatchEvent(evt)
    }

    const remove = (index: number) => {
      const list = [...props.modelValue]
      list.splice(index, 1)
      update(list)
    }

    return {
      styles,
      refUploadHandler,
      isMultiple,
      loading,
      iconStyle,
      headers,
      acceptText,
      action,
      beforeUpload,
      edit,
      remove
    }
  }
})
</script>
