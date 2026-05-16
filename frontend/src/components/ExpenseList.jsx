// this component shows all the expenses in a simple table
// each row has an edit button and a delete button on the right
// i added a confirmation step before deleting so nothing gets removed by accident
// if there are no expenses it shows a message instead of an empty table

import { useState } from 'react'
import { formatMoney, formatDate } from '../utils/api'

export default function ExpenseList({ expenses, onEdit, onDelete, loading }) {
  const [confirmId, setConfirmId] = useState(null)

  if (loading) {
    return <p style={{ color: '#888', padding: 20 }}>Loading...</p>
  }

  if (expenses.length === 0) {
    return <p style={{ color: '#888', padding: 20 }}>No expenses found.</p>
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Title</th>
          <th style={styles.th}>Category</th>
          <th style={styles.th}>Date</th>
          <th style={styles.th}>Amount</th>
          <th style={styles.th}></th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(expense => (
          <tr key={expense.id}>
            <td style={styles.td}>
              <div>{expense.title}</div>
              {expense.description && (
                <div style={styles.desc}>{expense.description}</div>
              )}
            </td>
            <td style={styles.td}>{expense.category}</td>
            <td style={styles.td}>{formatDate(expense.date)}</td>
            <td style={styles.td}>{formatMoney(expense.amount)}</td>
            <td style={styles.td}>
              {confirmId === expense.id ? (
                <div style={styles.actions}>
                  <button
                    style={styles.btnDanger}
                    onClick={() => {
                      onDelete(expense.id)
                      setConfirmId(null)
                    }}
                  >
                    Confirm
                  </button>
                  <button style={styles.btn} onClick={() => setConfirmId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={styles.actions}>
                  <button style={styles.btn} onClick={() => onEdit(expense)}>
                    Edit
                  </button>
                  <button style={styles.btn} onClick={() => setConfirmId(expense.id)}>
                    Delete
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  th: {
    textAlign: 'left',
    padding: '7px 10px',
    borderBottom: '1px solid #bbb',
    color: '#555',
    fontWeight: 'bold',
  },
  td: {
    padding: '9px 10px',
    borderBottom: '1px solid #eee',
    verticalAlign: 'top',
  },
  desc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  actions: {
    display: 'flex',
    gap: 6,
  },
  btn: {
    padding: '4px 10px',
    border: '1px solid #ccc',
    borderRadius: 3,
    background: 'white',
    fontSize: 12,
    cursor: 'pointer',
  },
  btnDanger: {
    padding: '4px 10px',
    border: '1px solid #c0392b',
    borderRadius: 3,
    background: 'white',
    color: '#c0392b',
    fontSize: 12,
    cursor: 'pointer',
  },
}
