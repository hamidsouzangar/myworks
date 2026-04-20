export const PERSONA_GROUPS = [
  {
    id: "group1_goofball",
    name: "The Hedonistic Goofball",
    tags: ["goofball", "low_stakes", "playful", "clown"],
    nicknames: [
      "The Fridge Raider", "Serotonin Squirrel", "Two-Foot Frequent Flier",
      "The Ambivert (Prefers Dog to People)", "CEO of Low Stakes Inc.",
      "The Stretch Armstrong Excuse", "Pizza Loop Victim", "The Couch Goblin (Satiated)",
      "Human Golden Retriever", "Purveyor of Ugly Thumb Selfies", "The Baby Race Pacifist",
      "Vibes-Based Navigation System", "Professional Yawn Disguiser",
      "The Party Pet Whisperer", "Captain Crunchwrap"
    ]
  },
  {
    id: "group2_antihero",
    name: "The Brooding Anti-Hero",
    tags: ["edgy", "chaotic", "voyeur", "vocal"],
    nicknames: [
      "The Unauthorized Biographer", "Gloom Merchant", "Fight Picker (Amateur Division)",
      "Naked Invisible Voyeur (God Tier Name)", "Eye Contact Predator", "The Playlist Autocrat",
      "Toddler's First Nemesis", "Morbid Curiosity Cabinet", "Vocal Mind Reader (No Filter)",
      "Villain Arc Enthusiast", "The Death Spoiler Seeker", "Chaos Gremlin (Reserved Seating)",
      "The Sigh Heard 'Round the World", "Industrial Music DJ", "Freudian Slip 'N Slide"
    ]
  },
  {
    id: "group3_nervous",
    name: "The Nervous Wreck",
    tags: ["nervous_energy", "avoidant", "flight_risk", "easily_embarrassed"],
    nicknames: [
      "The 3AM Replay Technician", "Feral Baseboard Cleaner", "The Peru Contingency Plan",
      "Naked Ghost (Anxious Variant)", "People-Pleasing Panic Machine", "The Regret Fixer Upper",
      "Cortisol Cowboy", "The Social Stretcher", "Flight of the Bumblebee (Always Buzzing)",
      "The Honest Finder (Terrified)", "Main Character in a Mumblecore Disaster",
      "Canine Emotional Support Leech", "Spiral Navigator (Expert Level)",
      "The Moist Towel of Doom (for cleaning)", "Staring Contest Loser (Pre-emptive)"
    ]
  },
  {
    id: "group4_feral",
    name: "The Feral Competitor",
    tags: ["ruthless", "competitive", "aggressive", "bold", "combative", "absolute_menace"],
    nicknames: [
      "The Party Leaderboard Assassin", "Toddler Annihilator", "Eye of the Tiger (Mom's Basement)",
      "Naked Invisible Sprinter", "The Shots Slinger", "Mind-Reading Trash Talker",
      "Cortisol Addict (Recreational)", "The Unblinking Wave Warrior", "Jumanji All-Star",
      "Pizza Week Time Trialist", "Ego Lifting (Emotional Edition)", "The Hostile Kitchen Takeover",
      "Data Harvesting Phone Checker", "Fight Club HR Representative", "Two-Foot High Speed Chase"
    ]
  },
  {
    id: "group5_softie",
    name: "The Lawful Good Softie",
    tags: ["softie", "people_pleaser", "honest", "lawful", "safe", "cautious"],
    nicknames: [
      "The Guilt Sponge", "Ankle-High Angel", "St. Bernard of the House Party",
      "The Apologetic Stumbler", "Regret Scrubber", "Virtue Signaler (But Genuine)",
      "The No-Fly Zone (Above 2ft)", "Keeper of the Lost Phone", "People-Pleaser Paladin",
      "The Great Yawn Faker", "Pizza Tuesday Altruist", "Support Class Human",
      "The Host's Favorite Guest (Non-Threatening)", "Chaos Aversion Specialist",
      "Emotional Support Sidekick"
    ]
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: "q1",
    title: "The Time Machine",
    text: "One-way time machine. Where to?",
    options: [
      { text: "Fix my biggest regret.", groups: ["group3_nervous", "group5_softie"] },
      { text: "See exactly how I die.", groups: ["group2_antihero", "group4_feral"] },
      { text: "Last Tuesday for good pizza.", groups: ["group1_goofball"] }
    ]
  },
  {
    id: "q2",
    title: "The Cursed Power",
    text: "Pick your cursed superpower:",
    options: [
      { text: "Read minds, say it out loud.", groups: ["group2_antihero", "group4_feral"] },
      { text: "Invisible, but only totally naked.", groups: ["group3_nervous"] },
      { text: "Fly, but only 2 feet high.", groups: ["group1_goofball", "group5_softie"] }
    ]
  },
  {
    id: "q3",
    title: "The Secret Ego",
    text: "If your life was a movie, you are secretly...",
    options: [
      { text: "The misunderstood Villain.", groups: ["group2_antihero"] },
      { text: "The Main Character.", groups: ["group3_nervous", "group4_feral"] },
      { text: "The Comic Relief.", groups: ["group1_goofball", "group5_softie"] }
    ]
  },
  {
    id: "q4",
    title: "The Pressure Test",
    text: "You are insanely stressed. You...",
    options: [
      { text: "Clean everything aggressively.", groups: ["group3_nervous", "group5_softie"] },
      { text: "Eat my feelings in the dark.", groups: ["group1_goofball"] },
      { text: "Pick a random fight.", groups: ["group2_antihero", "group4_feral"] }
    ]
  },
  {
    id: "q5",
    title: "The Vibe Check",
    text: "You just walked into a house party. You are...",
    options: [
      { text: "Taking shots in the kitchen.", groups: ["group4_feral"] },
      { text: "Petting the host's dog.", groups: ["group1_goofball", "group3_nervous", "group5_softie"] },
      { text: "Changing the host's music.", groups: ["group2_antihero"] }
    ]
  },
  {
    id: "q6",
    title: "The Mischief Test",
    text: "You find an unlocked phone on the table. You...",
    options: [
      { text: "Find the owner.", groups: ["group3_nervous", "group5_softie"] },
      { text: "Take an ugly selfie, put it back.", groups: ["group1_goofball"] },
      { text: "Read their texts.", groups: ["group2_antihero", "group4_feral"] }
    ]
  },
  {
    id: "q7",
    title: "The Humiliation Test",
    text: "You wave back at someone... but they were waving to the person behind you.",
    options: [
      { text: "Pretend I was just stretching.", groups: ["group1_goofball", "group5_softie"] },
      { text: "Maintain eye contact to assert dominance.", groups: ["group2_antihero", "group4_feral"] },
      { text: "Fake my death and move to Peru.", groups: ["group3_nervous"] }
    ]
  },
  {
    id: "q8",
    title: "The Empathy Test",
    text: "A 5-year-old challenges you to a foot race.",
    options: [
      { text: "Let them win.", groups: ["group1_goofball", "group3_nervous", "group5_softie"] },
      { text: "Sprint. Destroy them. No mercy.", groups: ["group2_antihero", "group4_feral"] },
      { text: "Trip them.", groups: ["group4_feral"] } // Trip them wasn't explicitly mapped in the doc but feral fits best
    ]
  }
];
