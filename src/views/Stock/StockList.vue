<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { SearchButton } from '@/components/SearchButton'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElTag } from 'element-plus'
import { Table } from '@/components/Table'
import { getStockListApi, saveStockApi, delStockListApi } from '@/api/stock'
import { useTable } from '@/hooks/web/useTable'
import { StockData } from '@/api/stock/types'
import { h, ref, unref, reactive } from 'vue'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useRoute } from 'vue-router'
import { useIcon } from '@/hooks/web/useIcon'
const route = useRoute()
// const qCode = route.query.code
const cateId = route.query.id

// console.log(qCode, id)

const { register, tableObject, methods } = useTable<StockData>({
  getListApi: getStockListApi,
  delListApi: delStockListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods
tableObject.params.id = cateId
getList()

const { t } = useI18n()

const plus = useIcon({ icon: 'ant-design:plus-outlined' })
const chart = useIcon({ icon: 'icon-park-outline:stock-market' })
const del = useIcon({ icon: 'ep:delete' })
const edit = useIcon({ icon: 'bx:edit' })

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index',
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'code',
    label: t('stock.code'),
    search: {
      show: true
    },
    form: {
      colProps: {
        span: 24
      }
    },
    detail: {
      span: 24
    }
  },
  {
    field: 'day',
    label: t('stock.day'),
    search: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'pattern',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: t('stock.headShoulder'),
            value: 1
          },
          {
            label: t('stock.getingChips'),
            value: 2
          },
          {
            label: t('stock.stars'),
            value: 3
          },
          {
            label: t('stock.gap'),
            value: 4
          }
        ]
      }
    },
    label: t('stock.pattern'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type:
            cellValue == 1 ? 'success' : cellValue == 2 ? 'warning' : cellValue == 3 ? '' : 'danger'
        },
        () =>
          cellValue == 1
            ? t('stock.headShoulder')
            : cellValue == 2
            ? t('stock.getingChips')
            : cellValue == 3
            ? t('stock.stars')
            : t('stock.gap')
      )
    },
    form: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: t('stock.headShoulder'),
            value: 1
          },
          {
            label: t('stock.getingChips'),
            value: 2
          },
          {
            label: t('stock.stars'),
            value: 3
          },
          {
            label: t('stock.gap'),
            value: 4
          }
        ]
      }
    }
  },
  {
    field: 'market',
    label: t('stock.market'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type:
            cellValue == 1
              ? 'danger'
              : cellValue == 2
              ? ''
              : cellValue == 3
              ? 'success'
              : 'warning',
          effect: 'dark'
        },
        () =>
          cellValue == 1
            ? t('stock.market_CH')
            : cellValue == 2
            ? t('stock.market_JP')
            : t('stock.market_X')
      )
    }
    // form: {
    //   component: 'Select',
    //   componentProps: {
    //     options: [
    //       {
    //         label: '中国',
    //         value: 1
    //       },
    //       {
    //         label: '日本',
    //         value: 2
    //       }
    //     ]
    //   }
    // }
  },
  {
    field: 'created_at',
    label: t('stock.create_at'),
    form: {
      show: false
    }
    // form: {
    //   component: 'DatePicker',
    //   componentProps: {
    //     type: 'datetime',
    //     valueFormat: 'YYYY-MM-DD HH:mm:ss'
    //   }
    // }
  },
  {
    field: 'remark',
    label: t('group.remark'),
    table: {
      show: false
    },
    form: {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 15
      },
      colProps: {
        span: 24
      }
    }
  },
  {
    field: 'action',
    width: '260px',
    label: t('tableDemo.action'),
    form: {
      show: false
    },
    detail: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')

const openTv = () => {
  window.open('https://www.tradingview.com/chart/CFSEAW1L/?symbol=NASDAQ%3ATSLA', '_blank')
}

const delLoading = ref(false)

const delData = async (row: StockData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

const actionType = ref('')

const action = (row: StockData, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  tableObject.currentRow = row
  dialogVisible.value = true
}
const addAction = () => {
  // dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  dialogTitle.value = t('exampleDemo.add')
  actionType.value = 'edit'
  tableObject.currentRow = null
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const loading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as StockData
      const res = await saveStockApi(data)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      if (res) {
        dialogVisible.value = false
        tableObject.currentPage = 1
        getList()
      }
    }
  })
}
</script>

<template>
  <ContentWrap>
    <div class="mb-10px float-left">
      <ElButton :icon="plus" type="primary" @click="addAction()" />
      <ElButton :icon="del" :loading="delLoading" type="danger" @click="delData(null, true)" />
    </div>
    <SearchButton
      :schema="allSchemas.searchSchema"
      @search="setSearchParams"
      @reset="setSearchParams"
    />

    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #action="{ row }">
        <ElButton :icon="chart" type="success" @click="openTv()" />

        <ElButton :icon="edit" type="primary" @click="action(row, 'edit')" />

        <ElButton :icon="del" type="danger" @click="delData(row, false)" />
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType === 'edit'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="tableObject.currentRow"
    />

    <Detail
      v-if="actionType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
      :current-row="tableObject.currentRow"
    />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
