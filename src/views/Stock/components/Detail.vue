<script setup lang="ts">
import { PropType } from 'vue'
import type { StockData } from '@/api/stock/types'
import { Descriptions } from '@/components/Descriptions'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag } from 'element-plus'

const { t } = useI18n()

defineProps({
  currentRow: {
    type: Object as PropType<Nullable<StockData>>,
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
    <template #importance="{ row }: { row: StockData }">
      <ElTag :type="row.pattern === 1 ? 'success' : row.pattern === 2 ? 'warning' : 'danger'">
        {{
          row.pattern === 1
            ? t('tableDemo.important')
            : row.pattern === 2
            ? t('tableDemo.good')
            : t('tableDemo.commonly')
        }}
      </ElTag>
    </template>

    <template #content="{ row }: { row: StockData }">
      <div v-html="row.remark"></div>
    </template>
  </Descriptions>
</template>
