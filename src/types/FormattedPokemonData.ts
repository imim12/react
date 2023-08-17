export interface FormattedPokemonData {
    id:              number;
    name:            string;
    weight:          number;
    height:          number;
    previous:        string | undefined;  //첫번째와 마지막은 previous, next 값이 없을수도 있어서 | undefined을 붙여줌
    next:            string | undefined;
    abilities:       string[];
    stats:           Stat[];
    DamageRelations: DamageRelation[];
    types:           string[];
    sprites:         string[];
    description:     string;
}

export interface DamageRelation {
    double_damage_from: DoubleDamageFrom[];
    double_damage_to:   DoubleDamageFrom[];
    half_damage_from:   DoubleDamageFrom[];
    half_damage_to:     DoubleDamageFrom[];
    no_damage_from:     any[];
    no_damage_to:       DoubleDamageFrom[];
}

export interface DoubleDamageFrom {
    name: string;
    url:  string;
}

export interface Stat {
    name:     string;
    baseStat: number;
}
