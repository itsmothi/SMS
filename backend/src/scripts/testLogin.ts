const test = async () => {
    try {
        console.log('Testing /api/health...');
        const res1 = await fetch('http://localhost:5000/api/health');
        console.log('Health:', await res1.text());

        console.log('Testing /api/auth/login...');
        const res2 = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: 'admin',
                password: 'admin'
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Login Status:', res2.status);
        console.log('Login Response:', await res2.json());
    } catch (e: any) {
        console.error('Request failed:', e.message);
    }
};

test();
