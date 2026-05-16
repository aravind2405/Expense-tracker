// this is the main component that controls everything on the page
// i used useState to keep track of which tab is open and what filters are selected
// it fetches expenses from the backend every time the filters change
// the form opens as a popup and closes after saving or cancelling

import { useState, useEffect, useCallback } from 'react'
import { api, CATEGORIES, formatMoney } from './utils/api'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Analytics from './components/Analytics'

export default function App() {
  const [view, setView] = useState('expenses')
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterMonth, setFilterMonth] = useState('')
  const [toast, setToast] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filterCategory !== 'All') params.category = filterCategory
      if (filterMonth) params.month = filterMonth
      const [expenseData, summaryData] = await Promise.all([
        api.getExpenses(params),
        api.getSummary(),
      ])
      setExpenses(expenseData)
      setSummary(summaryData)
    } catch (err) {
      showToast('Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }, [filterCategory, filterMonth])

  useEffect(() => {
    loadData()
  }, [loadData])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleCreate(data) {
    setFormLoading(true)
    try {
      await api.createExpense(data)
      setShowForm(false)
      showToast('Expense added.')
      loadData()
    } catch (err) {
      showToast(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleUpdate(data) {
    setFormLoading(true)
    try {
      await api.updateExpense(editingExpense.id, data)
      setEditingExpense(null)
      showToast('Expense updated.')
      loadData()
    } catch (err) {
      showToast(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteExpense(id)
      showToast('Expense deleted.')
      loadData()
    } catch (err) {
      showToast(err.message)
    }
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Expense Tracker</h1>
        <button style={styles.btnPrimary} onClick={() => setShowForm(true)}>
          Add Expense
        </button>
      </div>

      <div style={styles.tabs}>
        <button
          style={view === 'expenses' ? styles.tabActive : styles.tab}
          onClick={() => setView('expenses')}
        >
          Expenses
        </button>
        <button
          style={view === 'analytics' ? styles.tabActive : styles.tab}
          onClick={() => setView('analytics')}
        >
          Analytics
        </button>
      </div>

      <div style={styles.main}>
        {view === 'expenses' && (
          <div>
            <div style={styles.filters}>
              <select
                style={styles.select}
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <input
                style={styles.select}
                type="month"
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
              />

              <button
                style={styles.btnSecondary}
                onClick={() => {
                  setFilterCategory('All')
                  setFilterMonth('')
                }}
              >
                Clear
              </button>
            </div>

            <p style={styles.total}>
              Total: <strong>{formatMoney(total)}</strong> &nbsp;|&nbsp;
              {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
            </p>

            <ExpenseList
              expenses={expenses}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        )}

        {view === 'analytics' && (
          <Analytics summary={summary} loading={loading} />
        )}
      </div>

      {showForm && (
        <ExpenseForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          loading={formLoading}
        />
      )}

      {editingExpense && (
        <ExpenseForm
          initial={editingExpense}
          onSubmit={handleUpdate}
          onCancel={() => setEditingExpense(null)}
          loading={formLoading}
        />
      )}

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  )
}

const styles = {
  header: {
    padding: '14px 24px',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #ddd',
    padding: '0 24px',
  },
  tab: {
    padding: '10px 16px',
    border: 'none',
    background: 'none',
    fontSize: 13,
    color: '#888',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginBottom: -1,
  },
  tabActive: {
    padding: '10px 16px',
    border: 'none',
    background: 'none',
    fontSize: 13,
    color: '#111',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderBottom: '2px solid #111',
    marginBottom: -1,
  },
  main: {
    padding: '20px 24px',
    maxWidth: 860,
  },
  filters: {
    display: 'flex',
    gap: 10,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  select: {
    padding: '5px 8px',
    border: '1px solid #ccc',
    borderRadius: 3,
    fontSize: 13,
  },
  total: {
    fontSize: 13,
    color: '#444',
    marginBottom: 14,
  },
  btnPrimary: {
    padding: '7px 14px',
    border: 'none',
    borderRadius: 3,
    background: '#222',
    color: 'white',
    fontSize: 13,
  },
  btnSecondary: {
    padding: '5px 12px',
    border: '1px solid #ccc',
    borderRadius: 3,
    background: 'white',
    fontSize: 13,
    cursor: 'pointer',
  },
  toast: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    background: '#222',
    color: 'white',
    padding: '10px 16px',
    borderRadius: 4,
    fontSize: 13,
  },
}
