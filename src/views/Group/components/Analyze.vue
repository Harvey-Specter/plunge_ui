<script setup lang="ts">
import { PropType } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
// import type { GroupData } from '@/api/group/types'
import { EChartsOption } from 'echarts'
// import { Descriptions } from '@/components/Descriptions'
// import { useI18n } from '@/hooks/web/useI18n'
 import { ElRow, ElCol, ElCard } from 'element-plus'
import { Echart } from '@/components/Echart'

// const { t } = useI18n()

defineProps({
  pieOptionsInd: {
    type: Object as PropType<Nullable<EChartsOption>>,
    default: () => null
  },
  pieOptionsSize: {
    type: Object as PropType<Nullable<EChartsOption>>,
    default: () => null
  },
})
</script>

<template>
<ContentWrap>
    <ElRow :gutter="20" justify="space-between">
      <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <ElCard shadow="hover" class="mb-20px">
<Echart :options="pieOptionsInd" :height="400" :width="400" />
        </ElCard>
      </ElCol>
      <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <ElCard shadow="hover" class="mb-20px">
<Echart :options="pieOptionsSize" :height="400" :width="400" />
        </ElCard>
      </ElCol>
      
    </ElRow>
  </ContentWrap>
</template>
