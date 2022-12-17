export type Character =
    "Bowser" |
    "Donkey Kong" |
    "Dr. Mario" |
    "Falco" |
    "Captain Falcon" |
    "Fox" |
    "Mr. Game & Watch" |
    "Ganondorf" |
    "Ice Climbers" |
    "Jigglypuff" |
    "Kirby" |
    "Link" |
    "Luigi" |
    "Mario" |
    "Marth" |
    "Mewtwo" |
    "Ness" |
    "Peach" |
    "Pichu" |
    "Pikachu" |
    "Roy" |
    "Samus" |
    "Sheik" |
    "Yoshi" |
    "Young Link" |
    "Zelda";

const slugMap: Record<Character, string> = {
    "Bowser": "bowser",
    "Donkey Kong": "donkey-kong",
    "Dr. Mario": "dr-mario",
    "Falco": "falco",
    "Captain Falcon": "captain-falcon",
    "Fox": "fox",
    "Mr. Game & Watch": "mr-game-and-watch",
    "Ganondorf": "ganondorf",
    "Ice Climbers": "ice-climbers",
    "Jigglypuff": "jigglypuff",
    "Kirby": "kirby",
    "Link": "link",
    "Luigi": "luigi",
    "Mario": "mario",
    "Marth": "marth",
    "Mewtwo": "mewtwo",
    "Ness": "ness",
    "Peach": "peach",
    "Pichu": "pichu",
    "Pikachu": "pikachu",
    "Roy": "roy",
    "Samus": "samus",
    "Sheik": "sheik",
    "Yoshi": "yoshi",
    "Young Link": "young-link",
    "Zelda": "zelda"
};

export function getSlug(character: Character): string {
    return slugMap[character];
}