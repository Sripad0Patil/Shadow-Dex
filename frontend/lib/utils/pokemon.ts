import type { Pokemon } from '@/lib/context/GameContext';

export interface PokeAPIResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      home?: {
        front_default: string | null;
      };
      'official-artwork'?: {
        front_default: string | null;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

const JSDELIVR_SPRITES_BASE =
  'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon';

export function normalizeSpriteUrl(url: string): string {
  return url.replace(
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/',
    `${JSDELIVR_SPRITES_BASE}/`
  );
}

export function getPokemonImageUrl(id: number, sprites?: PokeAPIResponse['sprites']): string {
  const fromApi =
    sprites?.other?.['official-artwork']?.front_default ||
    sprites?.other?.home?.front_default ||
    sprites?.front_default;

  if (fromApi) return normalizeSpriteUrl(fromApi);

  return `${JSDELIVR_SPRITES_BASE}/other/official-artwork/${id}.png`;
}

export function getPokemonSpriteFallbackUrl(id: number): string {
  return `${JSDELIVR_SPRITES_BASE}/${id}.png`;
}

export async function fetchPokemonById(id: number): Promise<Pokemon | null> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) return null;

    const data: PokeAPIResponse = await response.json();

    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      imageUrl: getPokemonImageUrl(data.id, data.sprites),
      generation: getGenerationFromId(data.id),
      types: data.types.map((t) => t.type.name),
    };
  } catch (error) {
    console.error(`Failed to fetch Pokemon ${id}:`, error);
    return null;
  }
}

export async function fetchRandomPokemon(generation?: number): Promise<Pokemon | null> {
  let minId = 1;
  let maxId = 1025;

  if (generation) {
    const generationRanges: Record<number, [number, number]> = {
      1: [1, 151],
      2: [152, 251],
      3: [252, 386],
      4: [387, 493],
      5: [494, 649],
      6: [650, 721],
      7: [722, 809],
      8: [810, 905],
      9: [906, 1025],
    };
    const range = generationRanges[generation];
    if (range) {
      [minId, maxId] = range;
    }
  }

  for (let attempt = 0; attempt < 8; attempt++) {
    const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
    const pokemon = await fetchPokemonById(randomId);
    if (pokemon?.imageUrl) return pokemon;
  }

  return fetchPokemonById(minId);
}

export function getGenerationFromId(id: number): number {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 898) return 8;
  return 9;
}

export function convertToSilhouette(imageUrl: string): string {
  // Create a canvas-based silhouette by converting image to solid color
  // For now, we'll use CSS filters to create a silhouette effect
  return imageUrl;
}
