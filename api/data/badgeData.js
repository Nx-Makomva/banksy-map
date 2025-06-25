const badges = [
    {
        name: 'Wannabe Explorer',
        description: 'Visit 3 Banksy artworks',
        icon: '',
        criteria: { type: 'visits', count: 3 }
    },
    {
        name: 'Wannabe Collector',
        description: 'Bookmark 3 artworks',
        icon: '',
        criteria: { type: 'bookmarks', count: 3 }
    },
    {
        name: 'Welcome Aboard',
        description: 'Sign up and join the community',
        icon: '',
        criteria: { type: 'signup', count: 1 }
    },
    {
        name: 'Hoarder',
        description: 'Bookmark 25 artworks',
        icon:'',
        criteria: { type: 'bookmarks', count: 25 }
    },
    {
        name: 'Dora the Explorer',
        description: 'Visit 15 artworks',
        icon: '',
        criteria: { type: 'visits', count: 15 }
    }
]

module.exports = badges