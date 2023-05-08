import { request } from 'graphql-request'

export async function pager(endpoint, query, variables = {}) {
  if (endpoint.includes('undefined')) return {}

  // eslint-disable-next-line prefer-const
  let data: any = {}
  let skip = 0
  let flag = true

  while (flag) {
    flag = false
    // eslint-disable-next-line no-await-in-loop
    const req = await request(endpoint, query, variables)

    Object.keys(req).forEach((key) => {
      data[key] = data[key] ? [...data[key], ...req[key]] : req[key]
    })

    // eslint-disable-next-line no-loop-func
    Object.values(req).forEach((entry: any) => {
      if (entry.length === 1000) flag = true
    })

    // eslint-disable-next-line dot-notation
    if (Object.keys(variables).includes('first') && variables['first'] !== undefined) break

    skip += 1000
    // eslint-disable-next-line no-param-reassign
    variables = { ...variables, skip }
  }
  return data
}
