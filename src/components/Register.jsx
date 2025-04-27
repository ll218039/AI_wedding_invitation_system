import React, { useState } from 'react'

function Register({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password || !confirm) {
      alert('請填寫所有欄位')
      return
    }

    if (password !== confirm) {
      alert('兩次密碼不一致')
      return
    }

    // 取得現有帳戶資料
    const users = JSON.parse(localStorage.getItem('users') || '{}')

    if (users[email]) {
      alert('此帳號已存在')
      return
    }

    // 將新帳號加入 users 並存入 localStorage
    users[email] = password
    localStorage.setItem('users', JSON.stringify(users))

    alert('註冊成功，請登入')
    onSwitch()  // 切換回登入畫面
  }

  return (
    <div>
      <h2>註冊</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        <input type="password" placeholder="確認密碼" value={confirm} onChange={e => setConfirm(e.target.value)} /><br />
        <button type="submit">註冊</button>
      </form>
      <p>已經有帳號？<button onClick={onSwitch}>登入</button></p>
    </div>
  )
}

export default Register
