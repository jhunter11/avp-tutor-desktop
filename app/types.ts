/**
 * Typescript definitions.
 */
export type Step = {
  line: number | [number, number]
  actions: {
    cmd: string
    params: {
      [key: string]: any
    }
  }[]
};

export type VisData = {
  data: any[]
  type: string
  logs: string[]
  marks: {
    [key: string]: {
      type: string
      color: string
      value: string
    }[]
  }
};
