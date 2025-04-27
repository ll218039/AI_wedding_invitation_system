import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

// 將換行的純文字轉換為 HTML 段落
function convertTextToHtml(text) {
  return text
    .split('\n\n')
    .map((para) => `<p>${para.trim()}</p>`)
    .join('');
}

function Form({ onLogout }) {
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingLocation, setWeddingLocation] = useState('');

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [description, setDescription] = useState('');

  const [invitationContent, setInvitationContent] = useState('');

  const [guests, setGuests] = useState([]); // CSV 上傳來賓資料
  const [sentGuests, setSentGuests] = useState([]); // 已寄出清單

  useEffect(() => {
    const savedBrideName = localStorage.getItem('brideName');
    const savedGroomName = localStorage.getItem('groomName');
    const savedWeddingDate = localStorage.getItem('weddingDate');
    const savedWeddingLocation = localStorage.getItem('weddingLocation');

    if (savedBrideName) setBrideName(savedBrideName);
    if (savedGroomName) setGroomName(savedGroomName);
    if (savedWeddingDate) setWeddingDate(savedWeddingDate);
    if (savedWeddingLocation) setWeddingLocation(savedWeddingLocation);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setGuests(results.data);
      },
    });
  };

  const handleSelectGuest = (guest) => {
    setGuestName(guest['姓名'] || '');
    setGuestEmail(guest['Email'] || '');
    setRelationship(guest['關係'] || '');
    setDescription(guest['描述'] || '');
  };


  const handleGenerate = async () => {
    const formData = {
      brideName,
      groomName,
      weddingDate,
      weddingLocation,
      guestName,
      relationship,
      description,
    };

    try {
      const response = await fetch('https://yuchiao.app.n8n.cloud/webhook/se', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.text();
      setInvitationContent(data); // data 可以是 HTML 或純文字
    } catch (error) {
      alert('生成邀請函失敗');
      console.error(error);
    }
  };

  const handleSend = async () => {
    const formData = {
      brideName,
      groomName,
      weddingDate,
      weddingLocation,
      guestName,
      guestEmail,
      relationship,
      description,
      invitationContent,
    };
  
    try {
      const response = await fetch('https://yuchiao.app.n8n.cloud/webhook/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('邀請函已寄出！');


        //已寄出的做標記
        setGuests((prevGuests) =>
          prevGuests.map((guest) =>
            guest['Email'] === guestEmail ? { ...guest, sent: true } : guest
          )
        );

        // 清空欄位
        setGuestName('');
        setGuestEmail('');
        setRelationship('');
        setDescription('');
        setInvitationContent('');

        
        // 加入 sentGuests 陣列（如果你有顯示寄出記錄的話）
        setSentGuests((prev) => [
          ...prev,
          { name: guestName, email: guestEmail, relationship, description },
        ]);


      
      } else {
        alert('寄送失敗');
      }
    } catch (error) {
      alert('發生錯誤');
      console.error(error);
    }
  };
  
  const currentGuestSent = guests.find((g) => g['Email'] === guestEmail)?.sent;


  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'right' }}>
        <button onClick={onLogout}>登出</button>
      </div>

      <h2>婚禮喜帖邀請函</h2>

      <div>
        <label>新娘姓名：</label>
        <input type="text" value={brideName} onChange={(e) => setBrideName(e.target.value)} />

        <label>新郎姓名：</label>
        <input type="text" value={groomName} onChange={(e) => setGroomName(e.target.value)} />

        <label>婚禮日期：</label>
        <input type="date" value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} />

        <label>婚禮地點：</label>
        <input type="text" value={weddingLocation} onChange={(e) => setWeddingLocation(e.target.value)} />
      </div>

      
      
      <hr style={{ margin: '20px 0' }} />

      <div>
        <label>📁 上傳來賓 CSV：</label>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>

      {guests.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>📋 來賓清單（點選填入）</h4>
          <ul>
            {guests.map((guest, index) => (
              <li
                key={index}
                style={{
                  cursor: guest.sent ? 'not-allowed' : 'pointer',
                  marginBottom: '8px',
                  color: guest.sent ? '#aaa' : 'black',
                }}
                onClick={() => handleSelectGuest(guest)}
              >
                {guest['姓名']} ({guest['Email']}) {guest.sent && '✅ 已送出'}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <label>來賓姓名：</label>
        <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} />

        <label>來賓 Email：</label>
        <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />

        <label>與來賓的關係：</label>
        <input type="text" value={relationship} onChange={(e) => setRelationship(e.target.value)} />

        <label>新人對來賓的描述：</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <button onClick={handleGenerate} style={{ marginTop: '20px' }}>生成邀請函</button>

      {invitationContent && (
        <div style={{ marginTop: '40px' }}>
          <h3>邀請函預覽（可編輯）</h3>

          <textarea
            style={{ width: '100%', height: '200px' }}
            value={invitationContent}
            onChange={(e) => setInvitationContent(e.target.value)}
          />

          <h4 style={{ marginTop: '30px' }}>📨 Gmail 預覽樣式</h4>
          <div
            style={{
              marginTop: '10px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              lineHeight: '1.6',
            }}
            dangerouslySetInnerHTML={{
              __html: invitationContent.includes('<p>')
                ? invitationContent
                : convertTextToHtml(invitationContent),
            }}
          />

<button
            onClick={handleSend}
            style={{ marginTop: '20px' }}
            disabled={currentGuestSent}
          >
            送出邀請函
          </button>
        </div>
      )}
      {sentGuests.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3>📤 已寄出清單</h3>
          <ul>
            {sentGuests.map((guest, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                ✅ {guest.name} ({guest.email}) - {guest.relationship}
                <br />
                <span style={{ fontSize: '0.9em', color: '#555' }}>{guest.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Form;
