<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { SearchButton } from '@/components/SearchButton'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElTag } from 'element-plus'
import { Table } from '@/components/Table'
import {
  getStockListApi,
  saveStockApi,
  delStockListApi,
  getCatesByUserId,
  getCatesByUserIdCode
} from '@/api/stock'

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

const myUserId = route.query.myUserId as string
const cateId = route.query.id as never
const userId = route.query.userId

console.log(cateId, userId, myUserId)

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

const actionType = ref('')
const myCateIds = ref([])

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
      componentProps: {
        readonly: true
      },
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
        readonly: myUserId != userId,
        options: [
          {
            label: t('stock.headShoulder'),
            value: '1'
          },
          {
            label: t('stock.getingChips'),
            value: '2'
          },
          {
            label: t('stock.stars'),
            value: '3'
          },
          {
            label: t('stock.gap'),
            value: '4'
          }
        ]
      }
    },
    label: t('stock.pattern'),
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type:
            cellValue === '1'
              ? 'success'
              : cellValue === '2'
              ? 'warning'
              : cellValue === '3'
              ? ''
              : 'danger'
        },
        () =>
          cellValue === '1'
            ? t('stock.headShoulder')
            : cellValue === '2'
            ? t('stock.getingChips')
            : cellValue === '3'
            ? t('stock.stars')
            : t('stock.gap')
      )
    },
    form: {
      component: 'Select',
      componentProps: {
        disabled: myUserId != userId,
        options: [
          {
            label: t('stock.headShoulder'),
            value: '1'
          },
          {
            label: t('stock.getingChips'),
            value: '2'
          },
          {
            label: t('stock.stars'),
            value: '3'
          },
          {
            label: t('stock.gap'),
            value: '4'
          }
        ]
      }
    }
  },
  {
    field: 'market',
    label: t('stock.market'),
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type:
            cellValue == '1'
              ? 'danger'
              : cellValue == '2'
              ? ''
              : cellValue == '3'
              ? 'success'
              : 'warning',
          effect: 'dark'
        },
        () =>
          cellValue == '1'
            ? t('stock.market_CH')
            : cellValue == '2'
            ? t('stock.market_JP')
            : t('stock.market_X')
      )
    },
    form: {
      component: 'Select',
      componentProps: {
        disabled: myUserId != userId,
        options: [
          {
            label: '中国',
            value: '1'
          },
          {
            label: '日本',
            value: '2'
          }
        ]
      }
    }
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
    field: 'category_ids',
    label: t('stock.save_as_block'),
    table: {
      show: false
    },
    form: {
      colProps: {
        span: 24
      },
      component: 'CheckboxButton',
      value: [],
      componentProps: {
        options: [] // myCates
        // [
        //   {
        //     label: 'option-1',
        //     value: '1'
        //   },
        //   {
        //     label: 'option-2',
        //     value: '2'
        //   },
        //   {
        //     label: 'option-3',
        //     value: '23'
        //   }
        // ]
      }
    }
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
        readonly: myUserId != userId,
        type: 'textarea',
        rows: 10
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

let myCates = reactive<ComponentOptions[]>([])

const getCates = async () => {
  const res = await getCatesByUserId(myUserId)
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
  console.log('getCates==res=====', res)
  if (res) {
    myCates = res.data
    let ids = []
    for (let i = 0; i < res.data.length; i++) {
      ids.push(res.data[i].value as never)
    }
    myCateIds.value = ids
    console.log(myCates, myCateIds.value)

    if (crudSchemas.length >= 7) {
      crudSchemas[6]!.form!.componentProps!.options = myCates
    }
  }
}
getCates()

const myCatesOfcode = ref([])

const getCatesByCode = async (userId: string, code: string) => {
  const res = await getCatesByUserIdCode(userId, code)
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
  console.log('getCates==res=====', res)
  if (res) {
    myCates = res.data
    let ids = []
    for (let i = 0; i < res.data.length; i++) {
      ids.push(res.data[i].value as never)
    }
    myCatesOfcode.value = ids
    tableObject!.currentRow!.category_ids = myCatesOfcode.value
    //console.log(myCates,myCateIds.value)
  }
}
const action = async (row: StockData, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  if (crudSchemas.length >= 1) {
    crudSchemas[1]!.form!.componentProps!.readonly = true
  }
  tableObject.currentRow = row
  getCatesByCode(myUserId, row.code)
  dialogVisible.value = true
}
const addAction = () => {
  // dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  dialogTitle.value = t('exampleDemo.add')
  actionType.value = 'edit'
  tableObject.currentRow = {
    id: NaN,
    price_id: NaN,
    day: '',
    code: '',
    user_id: NaN,
    category_id: NaN,
    pattern: '',
    market: '',
    remark: '',
    created_at: '',
    category_ids: [cateId as number]
  }

  tableObject.currentRow.category_ids = [cateId]

  console.log(1, '1')
  if (crudSchemas.length >= 1) {
    crudSchemas[1]!.form!.componentProps!.readonly = false
  }
  // tableObject.currentRow.category_ids=[cateId as string]
  // tableObject.currentRow?.category_ids=myCateIds.value
  dialogVisible.value = true
}

// console.log('crudSchemas=====',myCates,'+==========+',crudSchemas[6].form.componentProps)

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

const writeRef = ref<ComponentRef<typeof Write>>()

const loading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as StockData
      console.log('stockSave====', data)
      return false
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
      <ElButton :disabled="userId != myUserId" :icon="plus" type="primary" @click="addAction()" />
      <ElButton
        :disabled="userId != myUserId"
        :icon="del"
        :loading="delLoading"
        type="danger"
        @click="delData(null, true)"
      />
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

        <ElButton
          :disabled="userId != myUserId"
          :icon="del"
          type="danger"
          @click="delData(row, false)"
        />
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
