
const AlertMessage = ({ message, type }: { message: string; type: "success" | "error" }) => {
  return (
    <div 
      style={{ 
        backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{ fontSize: '18px' }}>
        {type === 'success' ? '✓' : '⚠'}
      </div>
      <div style={{ fontSize: '16px', fontWeight: '500' }}>
        {message}
      </div>
    </div>
  );
};

export default AlertMessage;
