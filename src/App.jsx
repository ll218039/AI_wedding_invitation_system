import React, { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Form from './components/Form'

function App() {
  const [isLoginPage, setIsLoginPage] = useState(true)   // 控制登入/註冊頁
  const [loggedInEmail, setLoggedInEmail] = useState(null)  // 控制登入狀態

  // 如果登入成功，顯示 Form 頁面
  if (loggedInEmail) {
    return <Form email={loggedInEmail} onLogout={() => {
      setLoggedInEmail(null)
    }} />
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {isLoginPage ? (
        <Login
          onSwitch={() => setIsLoginPage(false)}
          onLoginSuccess={(email) => setLoggedInEmail(email)}
        />
      ) : (
        <Register onSwitch={() => setIsLoginPage(true)} />
      )}
    </div>
  )
}

export default App
