// this is the main component that controls everything on the page
// i used useState to keep track of which tab is open and what filters are selected
// it fetches expenses from the backend every time the filters change
// the form opens as a popup and closes after saving or cancelling

import { useState, useEffect, useCallback } from 'react'
import { api, CATEGORIES, formatMoney } from './utils/api'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Analytics from './components/Analytics'
import Login from './components/Login'
import Register from './components/Register'
import Admin from './components/Admin'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email'))
  const [userRole, setUserRole] = useState(localStorage.getItem('role'))
  const [authView, setAuthView] = useState('login')
  const [view, setView] = useState('expenses')
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterMonth, setFilterMonth] = useState('')
  const [searchText, setSearchText] = useState('')
  const [toast, setToast] = useState('')
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
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
      setError('Could not connect to the server. Please make sure the backend is running and try again.')
    } finally {
      setLoading(false)
    }
  }, [filterCategory, filterMonth])

  useEffect(() => {
    if (token) {
      loadData()
    }
  }, [loadData, token])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleLogin(data) {
    setToken(data.access_token)
    setUserEmail(localStorage.getItem('email'))
    setUserRole(localStorage.getItem('role'))
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    setToken(null)
    setUserEmail(null)
    setUserRole(null)
    setAuthView('login')
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

  const visibleExpenses = expenses.filter(e =>
    e.title.toLowerCase().includes(searchText.toLowerCase())
  )
  const total = visibleExpenses.reduce((sum, e) => sum + e.amount, 0)

  if (!token) {
    if (authView === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthView('register')}
        />
      )
    } else {
      return (
        <Register
          onSwitchToLogin={() => setAuthView('login')}
        />
      )
    }
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Expense Tracker</h1>
        <div style={styles.headerRight}>
          <span style={styles.userEmail}>{userEmail}</span>
          <button style={styles.btnPrimary} onClick={() => setShowForm(true)}>
            Add Expense
          </button>
          <button style={styles.btnLogout} onClick={handleLogout}>
            Logout
          </button>
        </div>
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
        {userRole === 'admin' && (
          <button
            style={view === 'admin' ? styles.tabActive : styles.tab}
            onClick={() => setView('admin')}
          >
            Admin
          </button>
        )}
      </div>
      <div style={styles.main}>
        {error && (
          <div style={styles.errorBanner}>
            <span>{error}</span>
            <button style={styles.retryBtn} onClick={loadData}>Retry</button>
          </div>
        )}
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
                type="text"
                placeholder="Search by title"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
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
              {visibleExpenses.length} expense{visibleExpenses.length !== 1 ? 's' : ''}
            </p>

            <ExpenseList
              expenses={visibleExpenses}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
              loading={loading}
              error={error}
            />
          </div>
        )}

        {view === 'analytics' && (
          <Analytics summary={summary} loading={loading} error={error} />
        )}

        {view === 'admin' && userRole === 'admin' && (
          <Admin />
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
    background: '#1d9e75',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 12,
    color: '#e1f5ee',
    marginRight: 4,
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
    color: '#0f6e56',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderBottom: '2px solid #1d9e75 ',
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
    borderRadius: 4,
    background: 'white',
    color: '#0f6e56',
    fontSize: 13,
    fontWeight: 'bold',

  },
  btnSecondary: {
    padding: '5px 12px',
    border: '1px solid #ccc',
    borderRadius: 3,
    background: 'white',
    fontSize: 13,
    cursor: 'pointer',
  },
  btnLogout: {
    padding: '6px 12px',
    border: '1px solid #9fe1cb',
    borderRadius: 4,
    background: 'transparent',
    color: 'white',
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
  errorBanner: {
    background: '#fdecea',
    border: '1px solid #f5c6cb',
    color: '#a02622',
    padding: '12px 16px',
    borderRadius: 4,
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
  },
  retryBtn: {
    padding: '5px 12px',
    border: '1px solid #a02622',
    borderRadius: 3,
    background: 'white',
    color: '#a02622',
    fontSize: 12,
    cursor: 'pointer',
  },
}