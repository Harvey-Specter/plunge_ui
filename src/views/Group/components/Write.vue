<script setup lang="ts">
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { GroupData } from '@/api/group/types'
import { useValidator } from '@/hooks/web/useValidator'

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<GroupData>>,
    default: () => null
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  }
})

const rules = reactive({
  name: [required()],
  category_ids:[required()]
  // code: [required()],
  // remark: [],
  // stocks: []
})

console.log('formSchema===', props.formSchema)
const { register, elFormRef, methods } = useForm({
  schema: props.formSchema
})

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    const { setValues } = methods
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

console.log('elFormRef===', elFormRef)

defineExpose({
  elFormRef,
  getFormData: methods.getFormData,
  setValues: methods.setValues
})
</script>

<template>
  <Form :rules="rules" @register="register" />
</template>
