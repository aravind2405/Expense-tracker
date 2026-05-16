// this shows a breakdown of spending by category
// the four boxes at the top show total spent, number of transactions, average and top category
// below that is a table showing how much was spent in each category
// the data comes from the analytics summary endpoint in the backend

import { formatMoney } from '../utils/api'

export default function Analytics({ summary, loading, error }) {
  if (error) {
    return <p style={{ color: '#888', padding: 20 }}>Error loading analytics. Check the error banner above.</p>
  }
  if (loading || !summary) {
    return <p style={{ color: '#888', padding: 20 }}>Loading...</p>
  }

  const { by_category, total_spent, total_entries } = summary
  const average = total_entries > 0 ? total_spent / total_entries : 0

  return (
    <div>
      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Total Spent</div>
          <div style={styles.statValue}>{formatMoney(total_spent)}</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Transactions</div>
          <div style={styles.statValue}>{total_entries}</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Average per Entry</div>
          <div style={styles.statValue}>{formatMoney(average)}</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Top Category</div>
          <div style={styles.statValue}>
            {by_category[0] ? by_category[0].category : 'None'}
          </div>
        </div>
      </div>

      <h3 style={styles.tableTitle}>Spending by Category</h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Total</th>
            <th style={styles.th}>Entries</th>
          </tr>
        </thead>
        <tbody>
          {by_category.map(row => (
            <tr key={row.category}>
              <td style={styles.td}>{row.category}</td>
              <td style={styles.td}>{formatMoney(row.total)}</td>
              <td style={styles.td}>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 28,
  },
  stat: {
    borderBottom: '1px solid #eee',
    paddingBottom: 12,
  },
  statLabel: {
    fontSize: 11,
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 4,
  },
  statValue: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
  tableTitle: {
    fontSize: '0.85rem',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: 12,
    fontWeight: 'normal',
  },
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
  },
}
