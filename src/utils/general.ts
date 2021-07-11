export function useState<T>(val: T) {
  let state = val
  const setCache = (data: Partial<T>) => {
    state = { ...state, ...data }
    return state
  }
  const getCache = () => state
  return [getCache, setCache]
}

export const valueOf = (f: any) => (typeof f === 'function' ? f() : f)
