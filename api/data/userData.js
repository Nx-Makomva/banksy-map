const bcrypt = require('bcrypt')

const users = [
    { 
    firstName: "Olly",
    lastName: "W",
    email: "olly@me.com",
    password: bcrypt.hashSync('password', 10),
    },
    { 
    firstName: "Meg",
    lastName: "A",
    email: "meg@me.com",
    password: bcrypt.hashSync('password', 10),
    },
    { 
    firstName: "Nic",
    lastName: "M",
    email: "nic@me.com",
    password: bcrypt.hashSync('password', 10),
    },
    { 
    firstName: "Irina",
    lastName: "P",
    email: "irina@me.com",
    password: bcrypt.hashSync('password', 10),
    },
    { 
    firstName: "Pat",
    lastName: "M",
    email: "pat@me.com",
    password: bcrypt.hashSync('password', 10),
    }
]


module.exports = users