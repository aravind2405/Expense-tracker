// i put all the fetch calls in one place so i dont repeat myself
// each function handles one thing like getting expenses or deleting one
// the request function at the top handles errors so i dont have to do it everywhere
// there are also helper functions here for formatting money and dates nicely

const BASE = '/api/expenses'

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Something went wrong' }))
    throw new Error(err.detail || 'Request failed')
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  getExpenses: (params = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v))
    return request(`${BASE}/?${q}`)
  },
  createExpense: (data) => request(BASE + '/', { method: 'POST', body: JSON.stringify(data) }),
  updateExpense: (id, data) => request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExpense: (id) => request(`${BASE}/${id}`, { method: 'DELETE' }),
  getSummary: () => request(`${BASE}/analytics/summary`),
}

export const CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Entertainment',
  'Health',
  'Shopping',
  'Education',
  'Utilities',
  'Other',
]

export function formatMoney(amount) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount)
}

export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return new Date(y, m - 1, d).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function todayISO() {
  return new Date().toISOString().split('T')[0]
}
