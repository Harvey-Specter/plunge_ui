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
  recStockListApi,
  rmfStockListApi,
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
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'

const route = useRoute()
// const qCode = route.query.code

// const myUserId = route.query.myUserId as string

console.log('route.query========', route.query)

const cateId = route.query.id as unknown as number
const userId = route.query.userId
const delFlag0 = route.query.del
const from = route.query.industry
const indId = route.query.indId
const size = route.query.size

let delFlag = 0
if (delFlag0) {
  delFlag = 1
}
console.log('delFlag----', delFlag)
const appStore = useAppStoreWithOut()
const { wsCache } = useCache()
const userInfo = wsCache.get(appStore.getUserInfo)

const myUserId = userInfo.id as string

console.log(myUserId, '========', userId)
let others = true
if (userId == myUserId) {
  others = false
}
// console.log('userInfo====',userInfo);
// console.log('route.query',route.query)

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
tableObject.params.del = delFlag
tableObject.params.userId = myUserId
tableObject.params.from = from
tableObject.params.indId = indId
tableObject.params.size = size

getList()

const { t } = useI18n()

const plus = useIcon({ icon: 'ant-design:plus-outlined' })
const chart = useIcon({ icon: 'icon-park-outline:stock-market' })
const del = useIcon({ icon: 'ep:delete' })
let edit = useIcon({ icon: 'bx:edit' })
if (delFlag == 1) {
  edit = useIcon({ icon: 'fa-solid:undo' })
}
const actionType = ref('')
const myCateIds = ref([])
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])

// const t1 = ref( 3 )

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'code',
    label: t('stock.code'),
    search: {
      show: true
    },
    // type: 'index',
    form: {
      componentProps: {
        readonly: true
      },
      colProps: {
        span: 12
      }
    },
    detail: {
      show: false
    }
  },
  {
    field: 'name',
    label: t('stock.code'),
    search: {
      show: true
    },
    form: {
      show: true,
      componentProps: {
        readonly: true
      },
      colProps: {
        span: 12
      }
    },
    detail: {
      span: 12
    }
  },
  {
    field: 'cate33',
    label: t('stock.day'),
    search: {
      show: false
    },
    form: {
      show: true,
      componentProps: {
        readonly: true
      },
      colProps: {
        span: 12
      }
    }
  },
  {
    field: 'size',
    label: t('stock.size'),
    table: {
      show: true
    },
    form: {
      show: true,
      componentProps: {
        readonly: true
      },
      colProps: {
        span: 12
      }
    }
  },
  {
    field: 'pattern',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        readonly: others,
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
      colProps: {
        span: 12
      },
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
    field: 'score',
    label: t('formDemo.rate'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type:
            cellValue === 0
              ? 'info'
              : cellValue === 1
              ? 'danger'
              : cellValue === 2
              ? 'danger'
              : cellValue === 3
              ? 'warning'
              : cellValue === 4
              ? ''
              : 'success',
          effect: 'dark',
          round: true
        },
        () => cellValue // cellValue
      )
    },
    form: {
      component: 'Rate',
      componentProps: {
        readonly: others,
        colors: colors,
        size: 'large'
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
        options: []
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
        readonly: others,
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
  // console.log('getCates==res.data=====', res.data)
  if (res) {
    myCates = res.data
    let ids = []
    for (let i = 0; i < res.data.length; i++) {
      ids.push(res.data[i].value as never)
    }
    myCateIds.value = ids
    // console.log(myCates, myCateIds.value)

    if (crudSchemas.length >= 8) {
      crudSchemas[7]!.form!.componentProps!.options = myCates
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
  // console.log('getCates==res=====', res)
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
  console.log('action_delflag====', delFlag)

  if (delFlag == 1) {
    console.log('now is in trash ; Do recover')
    await recData(row, false)
    getList()
  } else {
    dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
    actionType.value = type
    if (crudSchemas.length >= 1) {
      crudSchemas[0]!.form!.componentProps!.readonly = true
    }
    tableObject.currentRow = row
    getCatesByCode(myUserId, row.code)
    dialogVisible.value = true
  }
}
const addAction = () => {
  if (crudSchemas.length >= 1) {
    crudSchemas[0]!.form!.componentProps!.readonly = false
  }
  dialogTitle.value = t('exampleDemo.add')
  actionType.value = 'edit'

  tableObject.currentRow = {
    id: NaN,
    name: '0',
    cate33: '',
    code: '',
    user_id: myUserId,
    category_id: +cateId,
    pattern: '',
    market: '',
    remark: '',
    created_at: '',
    category_ids: [+cateId],
    score: 0
  }
  dialogVisible.value = true
}

const { allSchemas } = useCrudSchemas(crudSchemas)

const dialogVisible = ref(false)

const dialogTitle = ref('')

const openTv = (row) => {
  window.open('https://www.tradingview.com/chart/CFSEAW1L/?symbol=TSE%3A' + row.code, '_blank')
}
const delLoading = ref(false)

const delData = async (row: StockData | null, multiple: boolean, delFlag: number) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true

  if (delFlag == 1) {
    await rmfStockListApi(
      multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number] // ,multiple
    ).finally(() => {
      delLoading.value = false
      getList()
    })
  } else {
    await delList(
      multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
      multiple
    ).finally(() => {
      delLoading.value = false
    })
  }
}

const recData = async (row: StockData | null, multiple: boolean) => {
  console.log('recData==========')
  tableObject.currentRow = row
  const { getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true

  await recStockListApi(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number] // ,multiple
  ).finally(() => {
    delLoading.value = false
    getList()
  })
}

const writeRef = ref<ComponentRef<typeof Write>>()

const loading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    if (isValid) {
      // loading.value = true
      const data = (await write?.getFormData()) as StockData
      data.user_id = myUserId
      console.log('stockSave====', data)
      // return false
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
      <ElButton
        v-if="delFlag != 1"
        :disabled="others || delFlag == 1"
        :icon="plus"
        type="primary"
        @click="addAction()"
      />

      <ElButton v-if="delFlag == 1" :icon="edit" type="primary" @click="recData(null, true)" />

      <ElButton
        :disabled="others && delFlag == 0"
        :icon="del"
        :loading="delLoading"
        type="danger"
        @click="delData(null, true, delFlag)"
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
        <ElButton :icon="chart" type="success" @click="openTv(row)" />

        <ElButton :icon="edit" type="primary" @click="action(row, 'edit')" />

        <ElButton
          :disabled="others && delFlag == 0"
          :icon="del"
          type="danger"
          @click="delData(row, false, delFlag)"
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
