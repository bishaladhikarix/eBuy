import React, { useState } from 'react';
import { getToken } from '../../utils/auth';

const ChatDebugger: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      // Test basic connection
      const response = await fetch('http://localhost:5000/api/chat/rooms', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
        },
      });

      const responseText = await response.text();
      
      setTestResult(`
Status: ${response.status}
Status Text: ${response.statusText}
Response: ${responseText}
Token: ${getToken() ? 'Present' : 'Missing'}
      `);
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
      <h3>Chat Backend Debugger</h3>
      <button onClick={testBackendConnection} disabled={loading}>
        {loading ? 'Testing...' : 'Test Backend Connection'}
      </button>
      {testResult && (
        <pre style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', whiteSpace: 'pre-wrap' }}>
          {testResult}
        </pre>
      )}
    </div>
  );
};

export default ChatDebugger;
