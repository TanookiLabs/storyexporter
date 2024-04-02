export function trackerApi(config: {apiKey: string}) {
  async function request<TData>(url: string): Promise<TData> {
    const response = await fetch(url, {
      headers: {
        'X-TrackerToken': config.apiKey,
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      try {
        console.error(await response.text())
      } catch (er) {}
      throw new Error(`request failed with status ${response.status}`)
    }

    try {
      const json = (await response.json()) as TData
      return json
    } catch (er) {
      throw new Error('failed to parse response as json')
    }
  }

  async function paginate<T extends Array<any>>(url: string, pageCallback: (data: T) => Promise<unknown>) {
    let offset = 0
    let total = 0
    let limit = 0

    do {
      let urlWithParams = new URL(url)
      urlWithParams.searchParams.set('offset', offset.toString())
      urlWithParams.searchParams.set('envelope', 'true')

      const response = await request<{
        pagination: {
          total: number
          limit: number
          offset: number
        }
        data: T
      }>(urlWithParams.toString())

      total = response.pagination.total
      limit = response.pagination.limit
      offset = response.pagination.offset + limit

      if (response.data.length === 0) {
        break
      }

      await pageCallback(response.data)
    } while (offset < total)
  }

  /**
   * same api as paginate but only fetches a single page
   */
  async function page<T extends Array<any>>(url: string, pageCallback: (data: T) => Promise<unknown>) {
    const data = await request<T>(url)
    if (data.length === 0) {
      return
    }
    await pageCallback(data)
  }

  return {
    request: request,
    paginate: paginate,
    page: page,
  }
}
