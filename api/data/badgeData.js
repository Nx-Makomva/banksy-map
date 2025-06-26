const badges = [
    {
        name: 'Wannabe Explorer',
        description: 'Visit 3 Banksy artworks',
        icon: '/wannabe-explorer.png',
        criteria: { type: 'visits', count: 3 }
    },
    {
        name: 'Wannabe Collector',
        description: 'Bookmark 3 artworks',
        icon: '/wannabe-collector.png',
        criteria: { type: 'bookmarks', count: 3 }
    },
    {
        name: 'Welcome Aboard',
        description: 'Sign up and join the community',
        icon: '/welcome-aboard.png',
        criteria: { type: 'signup', count: 1 }
    },
    {
        name: 'Hoarder',
        description: 'Bookmark 25 artworks',
        icon:'/hoarder.png',
        criteria: { type: 'bookmarks', count: 25 }
    },
    {
        name: 'Dora the Explorer',
        description: 'Visit 15 artworks',
        icon: '/dora.png',
        criteria: { type: 'visits', count: 15 }
    }
]

module.exports = badges