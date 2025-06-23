const artworks = [
{
    title: "Very Little Helps",
    discoveryYear: "2008",
    address: "Essex Road, Islington, London, N1 8NE",
    location: { type: "Point", coordinates: [ -0.116773, 51.506950 ] },
    description: "Three children saluting a Tesco flag—critique of mass consumerism.",
    themeTags: ["consumerism","children","corporate critique"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "Cash Machine Girl",
    discoveryYear: "2007",
    address: "Exmouth Market, Clerkenwell, London, EC1R",
    location: { type: "Point", coordinates: [ -0.103357, 51.509865 ] },
    description: "Child lifted by ATM's robotic arm—critique of banking and capitalism.",
    themeTags: ["banking","child","capitalism"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "Choose Your Weapon",
    discoveryYear: "2010",
    address: "The Grange, Bermondsey, London, SE1 3AD",
    location: { type: "Point", coordinates: [ -0.058, 51.498 ] },
    description: "Hooded figure walking a barking dog—reference to Keith Haring.",
    themeTags: ["homage","dog","urban commentary"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "One Nation Under CCTV",
    discoveryYear: "2007",
    address: "Newman Street (formerly), Westminster, London, W1",
    location: { type: "Point", coordinates: [ -0.138, 51.515 ] },
    description: "Child painting phrase while watched by police and CCTV—surveillance critique.",
    themeTags: ["surveillance","child","state control"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "Pulp Fiction",
    discoveryYear: "2002",
    address: "Old Street, Shoreditch, London, EC2A",
    location: { type: "Point", coordinates: [ -0.087, 51.525 ] },
    description: "Travolta and Jackson with bananas instead of guns—pop‑culture twist.",
    themeTags: ["pop culture","film reference","humor"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "Slave Labour",
    discoveryYear: "2012",
    address: "Poundland, Wood Green, London, N22",
    location: { type: "Point", coordinates: [ -0.125, 51.590 ] },
    description: "Child sewing Union Jack bunting—critique of sweatshop labour.",
    themeTags: ["child labour","sweatshop","political"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "Girl with Balloon",
    discoveryYear: "2002",
    address: "Waterloo Bridge, South Bank, London, SE1",
    location: { type: "Point", coordinates: [ -0.113, 51.508 ] },
    description: "Girl reaching for heart-shaped balloon—hope and loss symbolism.",
    themeTags: ["hope","loss","minimalism"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "Falling Shopper",
    discoveryYear: "2011",
    address: "Bruton Lane, Mayfair, London, W1J 6PT",
    location: { type: "Point", coordinates: [ -0.1256, 51.5007 ] },
    description: "Same as Shop ’Til You Drop—consumerism falling theme.",
    themeTags: ["consumerism","fall","satire"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "The Drinker (statue)",
    discoveryYear: "2004",
    address: "Princes Circus, Shaftesbury Avenue, London, W1D",
    location: { type: "Point", coordinates: [ -0.128, 51.516 ] },
    description: "Satirical statue riffing on Rodin's Thinker—commentary on public behavior.",
    themeTags: ["statue","satire","public art"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "A Piranhas on Police Box",
    discoveryYear: "2024",
    address: "Ludgate Hill, City of London, EC4M",
    location: { type: "Point", coordinates: [ -0.099, 51.513 ] },
    description: "Piranhas stenciled on police box—part of London Zoo series.",
    themeTags: ["animal","London Zoo","recent"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "Elephants",
    discoveryYear: "2024",
    address: "Chelsea area, West London, SW3",
    location: { type: "Point", coordinates: [ -0.187, 51.484 ] },
    description: "Two elephants trunk-to-trunk—London Zoo series commentary.",
    themeTags: ["animal","London Zoo","environment"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "Monkeys on Bridge",
    discoveryYear: "2024",
    address: "Brick Lane bridge, East London, E1",
    location: { type: "Point", coordinates: [ -0.071, 51.522 ] },
    description: "Three monkeys climbing—London Zoo series.",
    themeTags: ["animal","urban","playful"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "Pelicans at Fish Bar",
    discoveryYear: "2024",
    address: "Walthamstow, East London, E17",
    location: { type: "Point", coordinates: [ -0.019, 51.585 ] },
    description: "Pelicans stealing fish from shop signage—London Zoo series.",
    themeTags: ["animal","humor","local"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "Rhinoceros",
    discoveryYear: "2024",
    address: "Westmoor Street, Charlton, London, SE7",
    location: { type: "Point", coordinates: [ 0.023, 51.492 ] },
    description: "Rhino stepping on car with traffic cone horn—London Zoo finale.",
    themeTags: ["animal","London Zoo","satire"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "Sweeping It Under The Carpet",
    discoveryYear: "2006",
    address: "Soho, London, W1D",
    location: { type: "Point", coordinates: [ -0.134, 51.514 ] },
    description: "A maid sweeping dirt under a carpet painted on a wall—commentary on social ignorance.",
    themeTags: ["social critique", "urban art", "humor"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "Mild Mild West",
    discoveryYear: "1999",
    address: "Stokes Croft, Bristol, UK (relocated piece shown occasionally in London exhibits)",
    location: { type: "Point", coordinates: [ -0.1276, 51.5074 ] }, // Center London approx coords
    description: "A teddy bear throwing a Molotov cocktail—anti-violence message.",
    themeTags: ["anti-violence", "iconic", "urban"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "The Little Diver",
    discoveryYear: "2009",
    address: "Camden Town, London, NW1",
    location: { type: "Point", coordinates: [ -0.142, 51.541 ] },
    description: "A stencil of a little diver underwater on a brick wall—surreal, playful street art.",
    themeTags: ["playful", "urban", "surreal"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "Rat with Camera",
    discoveryYear: "2013",
    address: "South Bank, London, SE1",
    location: { type: "Point", coordinates: [ -0.112, 51.505 ] },
    description: "A rat holding a vintage camera—Banksy's signature rat motif mixed with social commentary.",
    themeTags: ["rats", "photography", "street art"],
    photos: [],
    isAuthenticated: true
    },
    {
    title: "There Is Always Hope",
    discoveryYear: "2004",
    address: "Tate Modern, Bankside, London, SE1",
    location: { type: "Point", coordinates: [ -0.099, 51.507 ] },
    description: "Text reading ‘There Is Always Hope’ with balloon heart stencil—symbol of optimism.",
    themeTags: ["hope", "text art", "optimism"],
    photos: [],
    isAuthenticated: true
    }
]

module.exports = artworks;