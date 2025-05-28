import React from 'react';

const styles = {
    container: {
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        background: '#00a650',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '48px 32px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'Segoe UI, Arial, sans-serif',
    },
    icon: {
        fontSize: '56px',
        marginBottom: '16px',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 700,
        marginBottom: '12px',
    },
    message: {
        fontSize: '1.1rem',
        marginBottom: '8px',
    },
    small: {
        fontSize: '0.95rem',
        opacity: 0.9,
    }
};

export default function Agradecimento() {
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.icon}>✅</div>
                <div style={styles.title}>Obrigado pela sua compra!</div>
                <div style={styles.message}>
                    Sua compra foi realizada com sucesso em nossa loja.
                </div>
                <div style={styles.message}>
                    A nota fiscal chegará em seu e-mail em breve.
                </div>
                <div style={styles.small}>
                    Se tiver dúvidas, entre em contato com nosso suporte.<br />
                    Volte sempre!
                </div>
            </div>
        </div>
    );
}