// i made this component for new users to sign up
// it sends email and password to the backend register endpoint
// if it works it shows a message and switches to login screen
// the user can then login with the credentials they just made

import { useState } from 'react'

export default function Register({ onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.detail || 'Registration failed')
      }
      
      setSuccess('Account created. Redirecting to login...')
      setTimeout(() => {
        onSwitchToLogin()
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Register</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <p style={styles.switch}>
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} style={styles.linkBtn}>
            Login
          </button>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: 20,
  },
  box: {
    width: '100%',
    maxWidth: 360,
    padding: 30,
    border: '1px solid #ddd',
    borderRadius: 4,
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    background: '#fdecea',
    border: '1px solid #f5c6cb',
    color: '#a02622',
    padding: '10px 12px',
    borderRadius: 3,
    marginBottom: 14,
    fontSize: 13,
  },
  success: {
    background: '#e8f5e9',
    border: '1px solid #c8e6c9',
    color: '#2e7d32',
    padding: '10px 12px',
    borderRadius: 3,
    marginBottom: 14,
    fontSize: 13,
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
    width: '100%',
    padding: '8px',
    border: 'none',
    borderRadius: 3,
    background: '#222',
    color: 'white',
    fontSize: 13,
    marginTop: 6,
  },
  switch: {
    marginTop: 18,
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13,
    textDecoration: 'underline',
    padding: 0,
  },
}