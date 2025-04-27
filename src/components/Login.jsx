import React, { useState } from 'react'

function Login({ onSwitch, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      alert('請填寫所有欄位')
      return
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}')

    if (!users[email]) {
      alert('帳號不存在，請先註冊')
      return
    }

    if (users[email] !== password) {
      alert('密碼錯誤')
      return
    }

    alert(`登入成功：${email}`)
    onLoginSuccess(email)  // 通知 App.jsx 進入登入狀態
  }

  return (
    <div>
      <h2>登入</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        <button type="submit">登入</button>
      </form>
      <p>還沒有帳號？<button onClick={onSwitch}>註冊</button></p>
    </div>
  )
}


export default Login
