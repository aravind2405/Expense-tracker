// i made this component for the admin panel
// it shows a list of all users and the activity log
// only admins can see this because the backend checks the role
// the admin can also delete a user from the users table

import { useState, useEffect } from 'react'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const headers = { 'Authorization': `Bearer ${token}` }

      const [usersRes, activityRes] = await Promise.all([
        fetch('/api/auth/users', { headers }),
        fetch('/api/activity/', { headers })
      ])

      if (!usersRes.ok || !activityRes.ok) {
        throw new Error('Could not load admin data')
      }

      setUsers(await usersRes.json())
      setActivity(await activityRes.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleDeleteUser(email) {
    if (!window.confirm(`Delete user ${email}?`)) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/auth/users/${email}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Could not delete user')
      }

      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return <p style={{ color: '#888', padding: 20 }}>Loading...</p>
  }

  if (error) {
    return <p style={{ color: '#888', padding: 20 }}>{error}</p>
  }

  return (
    <div>
      <h3 style={styles.sectionTitle}>All Users</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Created</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>{u.role}</td>
              <td style={styles.td}>{u.created_at ? u.created_at.split('T')[0] : ''}</td>
              <td style={styles.td}>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDeleteUser(u.email)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={styles.sectionTitle}>Activity Log</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Action</th>
            <th style={styles.th}>Time</th>
          </tr>
        </thead>
        <tbody>
          {activity.map(a => (
            <tr key={a.id}>
              <td style={styles.td}>{a.user_email}</td>
              <td style={styles.td}>{a.action}</td>
              <td style={styles.td}>{a.timestamp.split('T')[0]} {a.timestamp.split('T')[1]?.slice(0, 8)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  sectionTitle: {
    fontSize: '0.85rem',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: 12,
    marginTop: 24,
    fontWeight: 'normal',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
    marginBottom: 10,
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
  deleteBtn: {
    padding: '4px 10px',
    border: '1px solid #c0392b',
    borderRadius: 3,
    background: 'white',
    color: '#c0392b',
    fontSize: 12,
    cursor: 'pointer',
  },
}