// i made this component for users to login
// it sends the email and password to the backend
// if login works it saves the token in localStorage
// then it tells the app to switch to the main screen

import { useState } from 'react'

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.detail || 'Login failed')
      }
      
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('email', email)
      onLogin(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Login</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        
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
            />
          </div>
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={styles.switch}>
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} style={styles.linkBtn}>
            Register
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
    padding: '9px',
    border: 'none',
    borderRadius: 4,
    background: '#1d9e75',
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
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
    color: '#0f6e56',
    fontWeight: 'bold',
    fontSize: 13,
    textDecoration: 'underline',
    padding: 0,
  }, 
}