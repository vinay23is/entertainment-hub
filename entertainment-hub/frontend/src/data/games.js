export const STEAM_IMG = (steamId) =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/header.jpg`
export const STEAM_HERO = (steamId) =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/library_hero.jpg`

export const GAMES = [
  {
    id: 1, steamId: 1245620, title: "Elden Ring", rating: 9.5,
    genre: "Action RPG", developer: "FromSoftware", year: 2022,
    description: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between. A game of astonishing scale set within a world of gripping stories and without a single wasted moment.",
    tags: ["Action", "RPG", "Open World", "Souls-like", "Fantasy"],
  },
  {
    id: 2, steamId: 1086940, title: "Baldur's Gate 3", rating: 9.8,
    genre: "RPG", developer: "Larian Studios", year: 2023,
    description: "Gather your party and venture into the Forgotten Realms. A game of exceptional depth and replayability that lets you choose your path through a vast story full of consequence.",
    tags: ["RPG", "Turn-Based", "Co-op", "Fantasy", "Story Rich"],
  },
  {
    id: 3, steamId: 1903340, title: "Alan Wake 2", rating: 8.9,
    genre: "Horror", developer: "Remedy Entertainment", year: 2023,
    description: "Alan Wake is trapped in the Dark Place. FBI Agent Saga Anderson investigates ritualistic murders in Bright Falls. Two stories intertwined in one terrifying nightmare.",
    tags: ["Horror", "Action", "Mystery", "Thriller", "Story Rich"],
  },
  {
    id: 4, steamId: 1091500, title: "Cyberpunk 2077", rating: 8.5,
    genre: "Action RPG", developer: "CD Projekt Red", year: 2020,
    description: "An open-world action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality.",
    tags: ["Open World", "RPG", "Cyberpunk", "Action", "Story Rich"],
  },
  {
    id: 5, steamId: 367520, title: "Hollow Knight", rating: 9.2,
    genre: "Metroidvania", developer: "Team Cherry", year: 2017,
    description: "Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs.",
    tags: ["Metroidvania", "Indie", "Platformer", "Action", "Difficult"],
  },
  {
    id: 6, steamId: 1593500, title: "God of War", rating: 9.3,
    genre: "Action-Adventure", developer: "Santa Monica Studio", year: 2022,
    description: "His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive and teach his son to do the same.",
    tags: ["Action", "Adventure", "Norse Mythology", "Story Rich"],
  },
  {
    id: 7, steamId: 1174180, title: "Red Dead Redemption 2", rating: 9.6,
    genre: "Action-Adventure", developer: "Rockstar Games", year: 2019,
    description: "America, 1899. The end of the Wild West era. Arthur Morgan and the Van der Linde gang are outlaws on the run. With federal agents and bounty hunters in pursuit, the gang must rob, steal and fight their way across the rugged heartland of America.",
    tags: ["Open World", "Western", "Story Rich", "Action", "Adventure"],
  },
  {
    id: 8, steamId: 292030, title: "The Witcher 3", rating: 9.4,
    genre: "RPG", developer: "CD Projekt Red", year: 2015,
    description: "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down the Child of Prophecy, a living weapon that can alter the shape of the world.",
    tags: ["RPG", "Open World", "Fantasy", "Story Rich", "Action"],
  },
  {
    id: 9, steamId: 1145360, title: "Hades", rating: 9.1,
    genre: "Roguelike", developer: "Supergiant Games", year: 2020,
    description: "Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion and Transistor.",
    tags: ["Roguelike", "Action", "Indie", "Dungeon Crawler"],
  },
  {
    id: 10, steamId: 413150, title: "Stardew Valley", rating: 9.0,
    genre: "Simulation", developer: "ConcernedApe", year: 2016,
    description: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn overgrown fields into a thriving home?",
    tags: ["Farming Sim", "RPG", "Indie", "Co-op", "Relaxing"],
  },
  {
    id: 11, steamId: 620, title: "Portal 2", rating: 9.7,
    genre: "Puzzle", developer: "Valve", year: 2011,
    description: "The single-player portion of Portal 2 introduces a cast of new characters and a wealth of fresh puzzle elements, while the co-operative game mode features its own unique story, test chambers, and two new player characters.",
    tags: ["Puzzle", "Co-op", "First-Person", "Sci-fi", "Comedy"],
  },
  {
    id: 12, steamId: 2767030, title: "Palworld", rating: 7.8,
    genre: "Survival", developer: "Pocketpair", year: 2024,
    description: "A community-based open-world survival crafting game. Craft, build, farm and fight alongside mysterious creatures called 'Pals'! Seamlessly switch between third-person exploration and Pal-based battles.",
    tags: ["Survival", "Open World", "Crafting", "Co-op", "Action"],
  },
  {
    id: 13, steamId: 1091800, title: "Dying Light 2", rating: 7.9,
    genre: "Action RPG", developer: "Techland", year: 2022,
    description: "Step into a post-apocalyptic open world. Your choices shape the future of a dangerous city overrun with infected. Use parkour to traverse rooftops and battle your way through the urban sprawl.",
    tags: ["Parkour", "Open World", "Zombie", "Action", "Co-op"],
  },
  {
    id: 14, steamId: 1282100, title: "It Takes Two", rating: 9.4,
    genre: "Co-op", developer: "Hazelight Studios", year: 2021,
    description: "Embark on the craziest adventure of your life in It Takes Two. Invite a friend to join for free with Friend's Pass and work together across a huge variety of gleefully disruptive gameplay challenges.",
    tags: ["Co-op", "Platformer", "Adventure", "Family", "Action"],
  },
  {
    id: 15, steamId: 1665460, title: "Dave the Diver", rating: 8.8,
    genre: "Adventure", developer: "MINTROCKET", year: 2023,
    description: "Dive into the ocean during the day to catch fish, run a sushi restaurant at night. Join Dave on a fun, thrilling adventure full of colorful characters, epic boss fights, and unexpected secrets.",
    tags: ["Adventure", "RPG", "Indie", "Simulation", "Fishing"],
  },
]
