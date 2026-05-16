// this form works for both adding a new expense and editing an existing one
// if an existing expense is passed in the fields fill up automatically
// i added basic validation so you cant submit without filling in the required fields
// it resets itself every time it opens so old data doesnt carry over

import { useState, useEffect } from 'react'
import { CATEGORIES, todayISO } from '../utils/api'

const emptyForm = {
  title: '',
  category: 'Food',
  amount: '',
  date: todayISO(),
  description: '',
}

export default function ExpenseForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(initial || emptyForm)
    setError('')
  }, [initial])

  function updateField(field) {
    return function (e) {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.title.trim()) {
      setError('Please enter a title.')
      return
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    if (!form.date) {
      setError('Please select a date.')
      return
    }

    setError('')
    await onSubmit({ ...form, amount: parseFloat(form.amount) })
  }

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {initial ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button style={styles.closeBtn} onClick={onCancel}>x</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input
              style={styles.input}
              value={form.title}
              onChange={updateField('title')}
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                style={styles.input}
                value={form.category}
                onChange={updateField('category')}
              >
                {CATEGORIES.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Amount (AUD)</label>
              <input
                style={styles.input}
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={updateField('amount')}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Date</label>
            <input
              style={styles.input}
              type="date"
              value={form.date}
              onChange={updateField('date')}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description (optional)</label>
            <textarea
              style={{ ...styles.input, resize: 'vertical' }}
              rows={3}
              value={form.description}
              onChange={updateField('description')}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.formBtns}>
            <button type="button" style={styles.btnSecondary} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Saving...' : initial ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: 16,
  },
  modal: {
    background: 'white',
    borderRadius: 6,
    width: '100%',
    maxWidth: 480,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    borderBottom: '1px solid #eee',
  },
  modalTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  closeBtn: {
    background: 'none',
    border: '1px solid #ccc',
    borderRadius: '50%',
    width: 28,
    height: 28,
    cursor: 'pointer',
    fontSize: 13,
  },
  form: {
    padding: '16px 18px 20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    marginBottom: 12,
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  label: {
    fontSize: 12,
    color: '#555',
  },
  input: {
    padding: '7px 9px',
    border: '1px solid #ccc',
    borderRadius: 3,
    fontSize: 13,
    width: '100%',
  },
  error: {
    color: '#c0392b',
    fontSize: 12,
    marginBottom: 10,
  },
  formBtns: {
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  btnSecondary: {
    padding: '7px 16px',
    border: '1px solid #ccc',
    borderRadius: 3,
    background: 'white',
    fontSize: 13,
  },
  btnPrimary: {
    padding: '7px 16px',
    border: 'none',
    borderRadius: 3,
    background: '#222',
    color: 'white',
    fontSize: 13,
  },
}
