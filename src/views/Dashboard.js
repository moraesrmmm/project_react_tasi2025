import React from 'react';

const Dashboard = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Dashboard</h1>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ flex: 1, padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
                    <h2>Card 1</h2>
                    <p>Some information here.</p>
                </div>
                <div style={{ flex: 1, padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
                    <h2>Card 2</h2>
                    <p>Some information here.</p>
                </div>
                <div style={{ flex: 1, padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
                    <h2>Card 3</h2>
                    <p>Some information here.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;