async function run() {
    console.log("Registering user...");
    const email = `test${Date.now()}@example.com`;
    let res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', email, password: 'password123' })
    });
    let data = await res.json();
    if (!data.token) {
        console.error("Failed to register:", data);
        return;
    }
    const token = data.token;
    console.log("Got token:", token.substring(0, 20) + "...");

    console.log("Adding address...");
    res = await fetch('http://localhost:5000/api/users/address', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
            country: 'USA',
            phone: '555-555-5555',
            type: 'Home'
        })
    });
    data = await res.json();
    console.log("Response status:", res.status);
    console.log("Response data:", data);
}

run();
