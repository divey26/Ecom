import React, { useState } from 'react';
import { Layout } from "antd";
import LayoutNew from '../../Layout';

const TimeLimitPage = () => {
  const [deadline, setDeadline] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const saveDeadline = async () => {
    if (deadline) {
      try {
        const response = await fetch('http://localhost:5000/api/deadline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deadline }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('Deadline saved successfully!');
        setIsSaved(true);
      } catch (error) {
        console.error('Error saving deadline:', error);
        alert('Failed to save deadline. Please try again.');
      }
    } else {
      alert('Please select a valid date and time.');
    }
  };

  return (
    <LayoutNew>
      <Layout style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
        <div style={{ textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>Set Time Limit</h1>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={{ padding: '10px', fontSize: '16px', marginBottom: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            onClick={saveDeadline}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Save Deadline
          </button>
          {isSaved && <p style={{ color: 'green', marginTop: '10px' }}>Deadline saved successfully!</p>}
        </div>
      </Layout>
    </LayoutNew>
  );
};

export default TimeLimitPage;
