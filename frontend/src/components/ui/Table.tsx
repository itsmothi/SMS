import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div style={{ overflowX: 'auto', width: '100%' }} className="brutal-border brutal-shadow">
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFF' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th 
                key={i} 
                style={{ 
                  padding: '16px', 
                  borderBottom: '3px solid #000', 
                  borderRight: i < headers.length - 1 ? '3px solid #000' : 'none',
                  backgroundColor: 'var(--secondary-color)',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  textAlign: 'left'
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow: React.FC<{ children: React.ReactNode; isLast?: boolean }> = ({ children, isLast }) => (
  <tr style={{ borderBottom: isLast ? 'none' : '3px solid #000' }}>
    {children}
  </tr>
);

export const TableCell: React.FC<{ children: React.ReactNode; isLast?: boolean }> = ({ children, isLast }) => (
  <td style={{ 
    padding: '16px', 
    borderRight: isLast ? 'none' : '3px solid #000',
    fontWeight: 600
  }}>
    {children}
  </td>
);
