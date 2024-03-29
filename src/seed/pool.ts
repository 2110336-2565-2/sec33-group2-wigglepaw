import { ReviewStatus } from "@prisma/client";

export const firstNames: string[] = [
  "Tokino",
  "Kanata",
  "Watame",
  "Roboco",
  "Suisei",
  "Azki",
  "Aki",
  "Akai",
  "Matsuri",
  "Mei",
];
export const lastNames: string[] = [
  "Amane",
  "Kiryuu",
  "Sora",
  "Haato",
  "Rosenthal",
  "Sung086",
];
export const addresses: string[] = [
  "Home",
  "Bangkok somewhere",
  "USA",
  "OHIO",
  "Chiangmai",
  "Isekai",
  "OtakuRoom",
];

export const petTypes: string[] = [
  "Dog",
  "Cat",
  "Goldfish",
  "Panda",
  "Snake",
  "Bat",
  "Lizard",
  "Hamster",
];

export const petBreeds: { [key: string]: string[] } = {
  Dog: [
    "Labrador Retriever",
    "German Shepherd",
    "Golden Retriever",
    "Bulldog",
    "Poodle",
  ],
  Cat: ["Siamese", "Persian", "Maine Coon", "Sphynx", "Bengal"],
  Goldfish: ["Comet", "Oranda", "Ryukin", "Fantail", "Black Moor"],
  Panda: [
    "Giant Panda",
    "Red Panda",
    "Qinling Panda",
    "Miniature Panda",
    "Brown Panda",
  ],
  Snake: [
    "Corn Snake",
    "Ball Python",
    "King Snake",
    "Boa Constrictor",
    "Rattlesnake",
  ],
  Bat: [
    "Fruit Bat",
    "Vampire Bat",
    "Horseshoe Bat",
    "Bulldog Bat",
    "Leaf-Nosed Bat",
  ],
  Lizard: ["Bearded Dragon", "Gecko", "Chameleon", "Iguana", "Skink"],
  Hamster: [
    "Syrian Hamster",
    "Dwarf Hamster",
    "Roborovski Hamster",
    "Chinese Hamster",
    "Campbell's Dwarf Hamster",
  ],
};

export const imageUris: string[] = [
  "https://i.ppy.sh/547c489981845883d37a525d50d892d8c3d490e0/68747470733a2f2f692e696d6775722e636f6d2f5430586455414e2e6a7067",
  "https://p4.wallpaperbetter.com/wallpaper/771/366/387/anime-anime-girls-hololive-kiryu-coco-redhead-hd-wallpaper-preview.jpg",
  "https://img-9gag-fun.9cache.com/photo/aZrDB5Q_460s.jpg",
  "https://preview.redd.it/8p4t0a95ax161.jpg?auto=webp&s=9c9db601dfdf217647380cbffe44d7eaf0efa47b",
  "https://gamerbraves.sgp1.cdn.digitaloceanspaces.com/2022/02/Rushia_FI2.jpg",
  "https://hololive.hololivepro.com/wp-content/uploads/2022/06/%E5%8D%9A%E8%A1%A3%E3%81%93%E3%82%88%E3%82%8A_WAO_jk-1.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGYXihhLktMheIVxxgkU3ouhnXf9F9wbxlhQ&usqp=CAU",
  "https://cdn.donmai.us/original/98/83/98834cd37301a94a6a524d94f1ff5a88.jpg",
  "https://static.wikia.nocookie.net/omniversal-battlefield/images/b/bd/Council.jpg/revision/latest?cb=20220420023638",
  "https://picsum.photos/200",
];

export const reviewTexts: string[] = [
  "My dog said it was great.",
  "good... I guess?",
  "dog shit",
  "Pretty nice",
  "Skibidi pop pop pop pop ye ye ye ye",
];

export const postTitles: string[] = [
  "Best dog ever",
  "Best cat ever",
  "Walking in the park",
  "OHIO is the best place ever",
  "OHIO is the worst place ever",
];

export const postTexts: string[] = [
  "Feeding dogs is my happiness",
  "I don't like this cat but took care of it anyway for monayyy",
  "I like this dog",
  "Took this dog for a walk",
  "Skibidi pop pop pop pop ye ye ye ye",
];

export const postPictures: string[] = [
  "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
  "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
  "https://c5.staticflickr.com/9/8768/28941110956_b05ab588c1_b.jpg",
  "https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_b.jpg",
  "https://c7.staticflickr.com/9/8569/28941134686_d57273d933_b.jpg",
  "https://c6.staticflickr.com/9/8342/28897193381_800db6419e_b.jpg",
  "https://c2.staticflickr.com/9/8239/28897202241_1497bec71a_b.jpg",
];

export const notes: string[] = [
  "My pet cannot eat carrots!",
  "Please walk my pet outside in the morning and evening.",
  "Feed my pets with Fit&Firm recipes only!",
  "Feeding schedule: 1 cup of dry food in the morning and 1 cup in the evening",
  "Don't forget to refill the water bowl every day",
  "Walk the dog for 30 minutes twice a day",
  "Cat litter box needs to be cleaned every other day",
  "Medication: give one pill with breakfast and one with dinner",
  "Please keep an eye on the fish tank and feed the fish once a day",
  "The bird needs fresh water and food every morning",
  "The hamster needs to have its wheel cleaned every few days",
  "Please keep the pet's play area clean and organized",
  "Emergency contact: Please call me if there are any issues or concerns.",
];

export const petNames: string[] = [
  "Buddy",
  "Max",
  "Bailey",
  "Lucy",
  "Charlie",
  "Rocky",
  "Sadie",
  "Daisy",
  "Toby",
  "Molly",
  "Lola",
  "Coco",
  "Chloe",
  "Maggie",
  "Rosie",
  "Sophie",
  "Zoe",
  "Ginger",
  "Milo",
  "Jack",
  "Bear",
  "Lucky",
  "Leo",
  "Oscar",
  "Harley",
  "Finn",
  "Bentley",
  "Zeus",
  "Duke",
  "Riley",
  "Stella",
  "Ruby",
  "Mia",
  "Roxy",
  "Penny",
  "Abby",
  "Luna",
  "Nala",
  "Bella",
  "Gracie",
  "Lily",
  "Emma",
  "Oliver",
  "Simba",
  "Jasper",
  "Whiskers",
  "Garfield",
  "Tigger",
  "Smokey",
  "Shadow",
  "Midnight",
  "Casper",
  "Cinnamon",
  "Biscuit",
  "Cookie",
  "Peanut",
  "Buttercup",
  "Honey",
  "Sunny",
  "Sandy",
  "Peaches",
  "Dusty",
  "Misty",
  "Snowball",
  "Angel",
  "Baby",
  "Beau",
  "Blue",
  "Boots",
  "Cody",
  "Copper",
  "Dexter",
  "Felix",
  "Gatsby",
  "Gizmo",
  "Henry",
  "Kiki",
  "Mittens",
];

export const sexes: string[] = ["Male", "Female"];

export const reviewStatuses: ReviewStatus[] = [
  ReviewStatus.pending,
  ReviewStatus.resolved,
  ReviewStatus.submitted,
];

export const ticketTitle: string[] = [
  "HE ATE MY DOG",
  "HE ATE MY CAT",
  "Can't press login button on iPhone69",
  "Review page not responsive",
  "Hello, I cannot see my previous payment slips",
];

export const ticketDescription: string[] = [
  "As the title said",
  "See title",
  "",
  "It only happens with bad Wifi",
  "It can be solved by repeatedly clicking, but I believe the app shouldn't behave like that.",
];

export const ticketNotes: string[] = ["LGTM", "lgtm but idk man", "sus"];

export const citysSubstr: string[] = [
  "Bang",
  "Chiang",
  "Rai",
  "Nakhon",
  "Si",
  "Ratchaburi",
  "Udon",
  "Thani",
  "Phetchabun",
  "Surin",
  "Trang",
  "Samut",
  "Sakhon",
];
