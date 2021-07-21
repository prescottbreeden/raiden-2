export function useState<T>(val: T) {
  let state = val
  const updateState = (data: Partial<T>) => {
    state = { ...state, ...data }
    return state
  }
  const readState = () => state
  return [readState, updateState]
}

export const valueOf = (f: any) => (typeof f === 'function' ? f() : f)

export function publicProperty<T>(name: string, val: () => T) {
  return {
    [name]: {
      enumerable: true,
      get: val,
    },
  }
}
