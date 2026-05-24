// i made this component for the user profile page
// the top part shows the account info like email role and join date
// below that is a form to change the password
// it checks the current password on the backend before changing it

import { useState, useEffect } from 'react'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  async function loadProfile() {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Could not load profile')
      setProfile(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  async function handleChangePassword(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Could not change password')
      }

      setSuccess('Password changed successfully.')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p style={{ color: '#888', padding: 20 }}>Loading...</p>
  }

  return (
    <div>
      <h3 style={styles.sectionTitle}>Account Info</h3>
      <table style={styles.table}>
        <tbody>
          <tr>
            <td style={styles.labelCell}>Email</td>
            <td style={styles.valueCell}>{profile.email}</td>
          </tr>
          <tr>
            <td style={styles.labelCell}>Role</td>
            <td style={styles.valueCell}>{profile.role}</td>
          </tr>
          <tr>
            <td style={styles.labelCell}>Joined</td>
            <td style={styles.valueCell}>
              {profile.created_at ? profile.created_at.split('T')[0] : ''}
            </td>
          </tr>
        </tbody>
      </table>

      <h3 style={styles.sectionTitle}>Change Password</h3>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <form onSubmit={handleChangePassword} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Current Password</label>
          <input
            style={styles.input}
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>New Password</label>
          <input
            style={styles.input}
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button type="submit" style={styles.button} disabled={saving}>
          {saving ? 'Saving...' : 'Change Password'}
        </button>
      </form>
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
    maxWidth: 360,
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  labelCell: {
    padding: '9px 10px',
    borderBottom: '1px solid #eee',
    color: '#888',
    width: 120,
  },
  valueCell: {
    padding: '9px 10px',
    borderBottom: '1px solid #eee',
  },
  form: {
    maxWidth: 360,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    display: 'block',
    fontSize: 12,
    marginBottom: 4,
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '7px 10px',
    border: '1px solid #ccc',
    borderRadius: 3,
    fontSize: 13,
  },
  button: {
    padding: '9px 16px',
    border: 'none',
    borderRadius: 4,
    background: '#1d9e75',
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  error: {
    background: '#fdecea',
    border: '1px solid #f5c6cb',
    color: '#a02622',
    padding: '10px 12px',
    borderRadius: 3,
    marginBottom: 14,
    fontSize: 13,
    maxWidth: 360,
  },
  success: {
    background: '#e8f5e9',
    border: '1px solid #c8e6c9',
    color: '#2e7d32',
    padding: '10px 12px',
    borderRadius: 3,
    marginBottom: 14,
    fontSize: 13,
    maxWidth: 360,
  },
}