const artworks = [
    {
    title: "Girl with Balloon",
    discoveryYear: "2002",
    streetName: "South Bank",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.1149, 51.5054]
        },
    description: "A girl reaching out toward a red, heart-shaped balloon, symbolizing hope and innocence.",
    themeTags: ["hope", "innocence", "love", "political"],
    photos: ["https://example.com/photos/girl-with-balloon-1.jpg"],
    isAuthenticated: true,
    comments: []
    },
    {
    title: "There Is Always Hope",
    discoveryYear: "2006",
    streetName: "South Bank",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.1138, 51.5057]
        },
    description: "Text-based graffiti often paired with the image of the girl and balloon, symbolizing optimism.",
    themeTags: ["hope", "text", "inspiration"],
    photos: ["https://example.com/photos/there-is-always-hope-1.jpg"],
    isAuthenticated: true,
    comments: []
    },
    {
    title: "Flower Thrower",
    discoveryYear: "2003",
    streetName: "Bethnal Green Road",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.0562, 51.5281]
        },
    description: "A masked protester throwing a bouquet of flowers instead of a Molotov cocktail.",
    themeTags: ["peace", "protest", "anti-violence"],
    photos: ["https://example.com/photos/flower-thrower-1.jpg"],
    isAuthenticated: true,
    comments: []
    },
    {
    title: "Pulp Fiction",
    discoveryYear: "2002",
    streetName: "North London",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.1570, 51.5470]
        },
    description: "Banksy’s iconic image of John Travolta and Samuel L. Jackson holding bananas instead of guns.",
    themeTags: ["pop culture", "irony", "film"],
    photos: ["https://example.com/photos/pulp-fiction-1.jpg"],
    isAuthenticated: true,
    comments: []
    },
    {
    title: "Kissing Coppers",
    discoveryYear: "2004",
    streetName: "Brighton Road",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.1387, 51.4623]
        },
    description: "Two British policemen kissing, challenging authority and societal norms.",
    themeTags: ["love", "authority", "LGBTQ+"],
    photos: ["https://example.com/photos/kissing-coppers-1.jpg"],
    isAuthenticated: true,
    comments: []
    },
    {
    title: "One Nation Under CCTV",
    discoveryYear: "2007",
    streetName: "East London",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.0482, 51.5194]
    },
    description: "A child painting the words ‘One Nation Under CCTV’, critiquing surveillance culture.",
    themeTags: ["surveillance", "political", "privacy"],
    photos: ["https://example.com/photos/one-nation-under-cctv-1.jpg"],
    isAuthenticated: true,
    comments: []
    },
    {
    title: "Laugh Now",
    discoveryYear: "2003",
    streetName: "Shoreditch",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.0705, 51.5265]
    },
    description: "Monkeys wearing sandwich boards with the phrase 'Laugh now, but one day we'll be in charge'.",
    themeTags: ["satire", "society", "humor"],
    photos: ["https://example.com/photos/laugh-now-1.jpg"],
    isAuthenticated: true,
    comments: []
    },
    {
    title: "Bomb Hugger",
    discoveryYear: "2004",
    streetName: "Camden",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.1425, 51.5416]
    },
    description: "A young girl hugging a bomb, juxtaposing innocence with violence.",
    themeTags: ["war", "innocence", "anti-war"],
    photos: ["https://example.com/photos/bomb-hugger-1.jpg"],
    isAuthenticated: true,
    comments: []
    },
    {
    title: "Mobile Lovers",
    discoveryYear: "2014",
    streetName: "Clapham",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.1381, 51.4610]
    },
    description: "A couple embracing while looking at their phones, commenting on modern disconnection.",
    themeTags: ["technology", "love", "modern life"],
    photos: ["https://example.com/photos/mobile-lovers-1.jpg"],
    isAuthenticated: true,
    comments: []
    },
    {
    title: "Shop Till You Drop",
    discoveryYear: "2011",
    streetName: "Notting Hill",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.2072, 51.5090]
        },
    description: "A child using a shopping trolley to escape from a bombing, commenting on consumerism and conflict.",
    themeTags: ["consumerism", "war", "social commentary"],
    photos: ["https://example.com/photos/shop-till-you-drop-1.jpg"],
    isAuthenticated: true,
    comments: []
    },
    {
    title: "Slave Labour",
    discoveryYear: "2012",
    streetName: "Bethnal Green",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.0595, 51.5276]
    },
    description: "Depicts a child sewing Union Jack bunting, critiquing child labor and consumer culture.",
    themeTags: ["child labor", "consumerism", "political"],
    photos: ["https://example.com/photos/slave-labour-1.jpg"],
    isAuthenticated: true,
    comments: []
    },
    {
    title: "The Mild Mild West",
    discoveryYear: "1997",
    streetName: "Stokes Croft",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-2.5862, 51.4605]
    },
    description: "A teddy bear throwing a Molotov cocktail, symbolizing resistance.",
    themeTags: ["resistance", "protest", "peace"],
    photos: ["https://example.com/photos/the-mild-mild-west-1.jpg"],
    isAuthenticated: false,
    comments: []
    },
    {
    title: "Napalm",
    discoveryYear: "2004",
    streetName: "Hackney",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.0571, 51.5450]
    },
    description: "A disturbing image featuring Mickey Mouse and Ronald McDonald holding hands with a naked girl, commenting on consumerism and war.",
    themeTags: ["consumerism", "war", "critique"],
    photos: ["https://example.com/photos/napalm-1.jpg"],
    isAuthenticated: true,
    comments: []
    },
    {
    title: "Self Portrait",
    discoveryYear: "2003",
    streetName: "Camden",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.1420, 51.5409]
    },
    description: "A stencil portrait of Banksy himself, rare and mysterious.",
    themeTags: ["self", "identity", "mystery"],
    photos: ["https://example.com/photos/self-portrait-1.jpg"],
    isAuthenticated: false,
    comments: []
    },
    {
    title: "Popes",
    discoveryYear: "2005",
    streetName: "Central London",
    city: "London",
    location: {
        type: "Point",
        coordinates: [-0.1246, 51.5081]
    },
    description: "Two popes kissing, a commentary on religion and acceptance.",
    themeTags: ["religion", "love", "controversy"],
    photos: ["https://example.com/photos/popes-1.jpg"],
    isAuthenticated: true,
    comments: []
    }
];

module.exports = artworks;