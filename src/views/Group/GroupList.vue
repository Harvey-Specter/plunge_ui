<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { SearchButton } from '@/components/SearchButton'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { Table } from '@/components/Table'
import {
  getGroupListApi,
  saveGroupApi,
  delGroupListApi,
  getStocksByCategoryId,
  cloneData,
  getGroupAll,
  getAnalyzeApi
} from '@/api/group'
import { useTable } from '@/hooks/web/useTable'
import { GroupData, Option } from '@/api/group/types'
import { ref, unref, reactive,nextTick } from 'vue'
import { Form, FormExpose } from '@/components/Form'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { useIcon } from '@/hooks/web/useIcon'
import { getCurrentUser } from '@/api/login'
import { pieOptions } from '@/views/Dashboard/echarts-data'
// import { Echart } from '@/components/Echart'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'
import { EChartsOption } from 'echarts'
import Analyze from './components/Analyze.vue'
// import { usePermissionStore } from '@/store/modules/permission'
const { t } = useI18n()

const pieOptionsInd= reactive<EChartsOption>(pieOptions)
// Industrial_Distribution: 'industrial distribution',
//     Size_Distribution: 'size distribution'
const pieOptionsSize= reactive<EChartsOption>({
  title: {
    text: t('group.Size_Distribution'),
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  series: [
    {
      name: t('analysis.userAccessSource'),
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        { value: 335, name: t('analysis.directAccess') },
        { value: 310, name: t('analysis.mailMarketing') },
        { value: 234, name: t('analysis.allianceAdvertising') },
        { value: 135, name: t('analysis.videoAdvertising') },
        { value: 1548, name: t('analysis.searchEngines') }
      ]
    }
  ]
})


const { register, tableObject, methods } = useTable<GroupData>({
  getListApi: getGroupListApi,
  delListApi: delGroupListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})
const appStore = useAppStoreWithOut()
const { wsCache } = useCache()
const userInfo = wsCache.get(appStore.getUserInfo)

let allGroup: Option[] = []

const allGroupList = async () => {
  const res = await getGroupAll()
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
  console.log('allGroupList==res=====', res)
  if (res) {
    allGroup = res.data

    if (groupSchema.length >= 2) {
      groupSchema[0]!.componentProps!.options = allGroup
    }
  }
}
allGroupList()

const userId = ref('')

const currUser = async () => {
  const res = await getCurrentUser()
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
  console.log('currUser==res=====', res)
  if (res) {
    userId.value = res.data.id
    userInfo.id = res.data.id
    wsCache.set(appStore.getUserInfo, userInfo)
  }
}
currUser()

const { getList, setSearchParams } = methods
const { push } = useRouter()
const plus = useIcon({ icon: 'ant-design:plus-outlined' })
// const chart = useIcon({ icon: 'icon-park-outline:stock-market' })
const table = useIcon({ icon: 'fluent:arrow-enter-20-filled' })
const del = useIcon({ icon: 'ep:delete' })
// const edit = useIcon({ icon: 'bx:edit' })
// const clone = useIcon({ icon: 'akar-icons:copy' })
const more = useIcon({ icon: 'ant-design:caret-down-filled' })

// const store = usePermissionStore()
// console.log('store===', store.getRouters.length, store.getRouters)
let router = useRouter()
getList()

const writeRef = ref<ComponentRef<typeof Write>>()
// const write = unref(writeRef)

const genCode = (val: string) => {
  console.log('genCode--val===', val)
  // write?.setValues({
  //   remark: val
  // })
  //console.log('genCode--val==end ', val)
}
// let expressionStr=''
const formRef = ref<FormExpose>()

const getLabelFromVal = (val: number) => {
  for (let i = 0; i < allGroup.length; i++) {
    console.log('grp===', allGroup[i], val)
    if (allGroup[i].value == val) {
      return allGroup[i].label
    }
  }
}

const genExp = (val: number) => {
  // console.log('genExp--val===', val)
  let label = getLabelFromVal(val)
  setValue(false, label)
}

const setValue = (reset: boolean, val: number | string | null | undefined) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      expression: val
    })
  }
}

const groupSchema = reactive<FormSchema[]>([
  {
    field: 'cate1',
    label: t('stock.theGroup') + '1',
    component: 'Select',

    colProps: {
      span: 12
    },
    componentProps: {
      onChange: genExp,
      style: {
        width: '400px'
      },
      options: allGroup
    }
  },
  {
    field: 'clac1',
    label: '',
    component: 'RadioButton',
    colProps: {
      span: 12
    },
    componentProps: {
      onChange: genExp,
      options: [
        {
          label: t('stock.union'),
          value: 1
        },
        {
          label: t('stock.intersect'),
          value: 2
        },
        {
          label: t('stock.minus'),
          value: 3
        }
      ]
    }
  },
  {
    field: 'cate2',
    label: t('stock.theGroup') + '2',
    component: 'Select',
    colProps: {
      span: 12
    },
    componentProps: {
      style: {
        width: '400px'
      },
      options: [
        {
          label: 'option1',
          value: '1'
        },
        {
          label: 'option2',
          value: '2'
        }
      ]
    }
  },
  {
    field: 'clac2',
    label: '',
    component: 'RadioButton',
    colProps: {
      span: 12
    },
    componentProps: {
      options: [
        {
          label: t('stock.union'),
          value: 1
        },
        {
          label: t('stock.intersect'),
          value: 2
        },
        {
          label: t('stock.minus'),
          value: 3
        }
      ]
    }
  },
  {
    field: 'cate3',
    label: t('stock.theGroup') + '3',
    component: 'Select',
    colProps: {
      span: 12
    },
    componentProps: {
      style: {
        width: '400px'
      },
      options: [
        {
          label: 'option1',
          value: '1'
        },
        {
          label: 'option2',
          value: '2'
        }
      ]
    }
  },
  {
    field: 'clac3',
    label: '',
    component: 'RadioButton',
    colProps: {
      span: 12
    },
    componentProps: {
      options: [
        {
          label: t('stock.union'),
          value: 1
        },
        {
          label: t('stock.intersect'),
          value: 2
        },
        {
          label: t('stock.minus'),
          value: 3
        }
      ]
    }
  },
  {
    field: 'cate4',
    label: t('stock.theGroup') + '4',
    component: 'Select',
    colProps: {
      span: 12
    },
    componentProps: {
      style: {
        width: '400px'
      },
      options: [
        {
          label: 'option1',
          value: '1'
        },
        {
          label: 'option2',
          value: '2'
        }
      ]
    }
  },
  {
    field: 'expression',
    label: t('stock.expression'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      readonly: true
    }
  },
  {
    field: 'newCate',
    label: t('stock.newCate'),
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {}
  }
])
//-----------------------
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
    field: 'name',
    label: t('group.name'),
    search: {
      show: true,
      componentProps: {
        onChange: genCode
      }
    },
    form: {
      colProps: {
        span: 24
      }
      // componentProps: {
      //   onChange: genCode
      // }
    },
    detail: {
      span: 12
    }
  },
  // {
  //   field: 'code',
  //   label: t('group.code')
  // },
  {
    field: 'stock_count',
    label: t('group.stock_count'),
    type: 'count',
    disabled: true,
    form: {
      show: false,
      componentProps: {
        disabled: true
      }
    }
  },
  {
    field: 'created_at',
    label: t('tableDemo.displayTime'),
    form: {
      show: false,
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        disabled: true
      }
    }
  },
  {
    field: 'remark',
    label: t('group.remark'),
    form: {
      component: 'Input',
      colProps: {
        span: 24
      }
    }
  },
  {
    field: 'stocks',
    label: t('group.stocks'),
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
    label: t('stock.action'),
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

const chartVisible = ref(false)

const dialogTitle = ref('')

const dialogVisible2 = ref(false)

const delLoading = ref(false)

const delData = async (row: GroupData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

const analyze = async (row: GroupData | null) => {
  
  tableObject.currentRow = row
  chartVisible.value = true
 const res = await getAnalyzeApi(row?.id)
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })

  console.log(res)
  if(res){
    
    nextTick(()=>{
      pieOptionsInd!.series![0]!.data=res.data.ind
      pieOptionsSize!.series![0]!.data=res.data.size
      console.log('pieOptionsInd,',pieOptionsInd)  
    })
  }
}

// getList: async () => {
//       tableObject.loading = true
//       const res = await config?.getListApi(unref(paramsObj)).finally(() => {
//         tableObject.loading = false
//       })
//       if (res) {
//         tableObject.tableList = get(res.data || {}, config?.response.list as string)
//         tableObject.total = get(res.data || {}, config?.response?.total as string) || 0
//       }
//     },

const actionType = ref('')

//const save = async () => {
const action = async (row: GroupData, type: string) => {
  // console.log('action--type===', type, row)
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'group.analyze')
  actionType.value = type
  tableObject.currentRow = row

if(type === 'edit'){
  const res = await getStocksByCategoryId({ id: row.id })
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })

  console.log('res=====', res)
  if (res) {
    let stockCodes = []
    for (let item of res.data) {
      stockCodes.push(item.code as never)
    }
    tableObject.currentRow.stocks = stockCodes.join(',')
    dialogVisible.value = true
  }
}else if(type === 'analyze'){

  dialogVisible.value = true

  const res = await getAnalyzeApi(row?.id)
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })

  console.log(res)
  if(res){
    
    nextTick(()=>{
      
      pieOptionsInd!.series![0]!.data=res.data.ind
      pieOptionsSize!.series![0]!.data=res.data.size

      console.log('pieOptionsInd,',pieOptionsInd)  
      
      
    })
  }
}
  
  
}

const cloneGroup = async (row: GroupData) => {
  tableObject.currentRow = row

  delLoading.value = true
  await cloneData(row).finally(() => {
    delLoading.value = false
    getList()
  })
}

const addAction = (type: string) => {
  dialogTitle.value = t('exampleDemo.add')
  actionType.value = type
  tableObject.currentRow = null
  dialogVisible.value = true
}
const openDetail = (row: GroupData) => {
  let url = '/stock/StockList' + row.id
  let queryParam = {
    id: row.id,
    userId: row.user_id
    // myUserId: userId.value
    // code: row.code.replace(/ /g, '')
  }
  let r: RouteRecordRaw = {
    path: url,
    component: () => import('@/views/Stock/StockList.vue'),
    name: 'stock_' + row.id,
    meta: {
      title: row.name,
      icon: 'carbon:skill-level-advanced',
      breadcrumb: true
    }
  }
  router.addRoute('Group', r)
  push({ path: url, query: queryParam })
}
const loading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  await write?.elFormRef?.validate(async (isValid) => {
    // console.log('isValid===', isValid)
    if (isValid) {
      loading.value = true
      const data = (await write?.getFormData()) as GroupData
      // console.log('data====', data) ;return false
      const res = await saveGroupApi(data)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })

      console.log('res=====', res)
      if (res) {
        dialogVisible.value = false
        tableObject.currentPage = 1
        getList()
      }
    }
  })
}
const formSubmit = () => {
  unref(formRef)
    ?.getElFormRef()
    ?.validate((valid) => {
      if (valid) {
        console.log('submit success')
      } else {
        console.log('submit fail')
      }
    })
}
</script>

<template>
  <ContentWrap>
    <div class="mb-10px float-left">
      <ElButton type="primary" :icon="plus" @click="addAction('edit')" />
      <ElButton :loading="delLoading" :icon="del" type="danger" @click="delData(null, true)" />
      <ElButton type="warning" @click="dialogVisible2 = !dialogVisible2">{{
        t('stock.setCalc')
      }}</ElButton>
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
        <ElButton :icon="table" type="success" @click="openDetail(row)" />

        <!-- ElButton
          :disabled="userId != row.user_id"
          type="primary"
          :icon="edit"
          @click="action(row, 'edit')"
        />

        <ElButton :icon="clone" type="warning" @click="cloneGroup(row)" />

        <ElButton
          :disabled="userId != row.user_id"
          type="danger"
          :icon="del"
          @click="delData(row, false)"
        / -->

        <ElDropdown trigger="click">
          <ElButton :icon="more" type="primary" />

          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem @click="action(row, 'edit')"> {{ t('group.edit') }} </ElDropdownItem>
              <ElDropdownItem @click="cloneGroup(row)"> {{ t('group.clone') }} </ElDropdownItem>
              <ElDropdownItem @click="action(row,'analyze')"> {{ t('group.analyze') }} </ElDropdownItem>
              <ElDropdownItem @click="delData(row, false)">
                {{ t('group.delete') }}
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </template>
    </Table>
  </ContentWrap>

  <Dialog v-model="dialogVisible2" :title="t('stock.setCalc')" :maxHeight="320">
    <Form ref="formRef" :schema="groupSchema" />
    <template #footer>
      <ElButton type="primary" @click="formSubmit">{{ t('dialogDemo.submit') }}</ElButton>
      <ElButton @click="dialogVisible2 = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>

  <Dialog v-model="dialogVisible" :title="dialogTitle" width="65%">

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

    <Analyze
      v-if="actionType === 'analyze'" :pieOptionsInd="pieOptionsInd" :pieOptionsSize="pieOptionsSize"
    />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="loading" @click="save">
        {{ t('exampleDemo.save') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>
