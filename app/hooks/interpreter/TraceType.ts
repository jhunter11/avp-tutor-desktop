export interface ActionParams {
  name?: string
  value?: any
  level?: string
  text?: string
  type?: string
  data?: any[]
  index?: number
  index2?: number
  color?: string
}

export interface TraceAction {
  cmd: 'var_add' | 'var_delete' | 'var_greyout' | 'var_normal' | 'vis_init' | 'vis_mark' | 'vis_unmark' | 'vis_log' | 'vis_insert' | 'vis_delete' | 'vis_update' | 'vis_swap' | 'vis_sort'
  params: ActionParams
}

export interface TraceStep {
  line: number | number[]
  actions: TraceAction[]
}
