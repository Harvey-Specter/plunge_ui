<script setup lang="ts">
import { PropType } from 'vue'
import type { GroupData } from '@/api/group/types'
import { Descriptions } from '@/components/Descriptions'
// import { useI18n } from '@/hooks/web/useI18n'
// import { ElTag } from 'element-plus'

// const { t } = useI18n()

defineProps({
  currentRow: {
    type: Object as PropType<Nullable<GroupData>>,
    default: () => null
  },
  detailSchema: {
    type: Array as PropType<DescriptionsSchema[]>,
    default: () => []
  }
})
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}">
    <!--template #importance="{ row }: { row: GroupData }">
      <ElTag :type="row.importance === 1 ? 'success' : row.importance === 2 ? 'warning' : 'danger'">
        {{
          row.importance === 1
            ? t('tableDemo.important')
            : row.importance === 2
            ? t('tableDemo.good')
            : t('tableDemo.commonly')
        }}
      </ElTag>
    </template-->

    <template #content="{ row }: { row: GroupData }">
      <div v-html="row.remark"></div>
    </template>
  </Descriptions>
</template>
