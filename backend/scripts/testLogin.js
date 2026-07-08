const axios = require('axios')

axios.post('http://localhost:3001/api/auth/login', { email: 'admin@techno-logia.fr', password: 'admin123' })
    .then(res => console.log('OK', res.data))
    .catch(err => {
        if (err.response) console.error('RESP', err.response.status, err.response.data)
        else console.error('ERR', err.message)
    })
