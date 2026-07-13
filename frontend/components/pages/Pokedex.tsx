'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GameContainer from '@/components/game/GameContainer';
import PokemonCard from '@/components/pokedex/PokemonCard';
import { getPokemonImageUrl, getGenerationFromId } from '@/lib/utils/pokemon';
import { getUserStorageKey } from '@/lib/utils/storage';
import { useAuth } from '@/lib/context/AuthContext';
import { ChevronLeft, Search } from 'lucide-react';

interface PokemonEntry {
  id: number;
  name: string;
  imageUrl: string;
  guessed: boolean;
}

const generations = [
  { name: 'All Generations', value: 'all' },
  { name: 'Gen 1 (Kanto)', value: 1 },
  { name: 'Gen 2 (Johto)', value: 2 },
  { name: 'Gen 3 (Hoenn)', value: 3 },
  { name: 'Gen 4 (Sinnoh)', value: 4 },
  { name: 'Gen 5 (Unova)', value: 5 },
  { name: 'Gen 6 (Kalos)', value: 6 },
  { name: 'Gen 7 (Alola)', value: 7 },
  { name: 'Gen 8 (Galar)', value: 8 },
  { name: 'Gen 9 (Paldea)', value: 9 },
];

export default function Pokedex() {
  const router = useRouter();
  const { user } = useAuth();
  const [pokemon, setPokemon] = useState<PokemonEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [guessedOnly, setGuessedOnly] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState<number | 'all'>('all');

  useEffect(() => {
    const historyKey = getUserStorageKey('gameHistory', user?.id);
    const gameHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const guessedPokemonIds = new Set<number>();

    gameHistory.forEach((game: any) => {
      if (game.currentPokemon && game.currentPokemon.id) {
        guessedPokemonIds.add(game.currentPokemon.id);
      }
    });

    // Fetch pokemon list with actual names from PokéAPI
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const data = await response.json();
        
        const pokemonList: PokemonEntry[] = data.results.map((p: any, index: number) => ({
          id: index + 1,
          name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
          imageUrl: getPokemonImageUrl(index + 1),
          guessed: guessedPokemonIds.has(index + 1),
        }));
        
        setPokemon(pokemonList);
      } catch (error) {
        console.error('[v0] Failed to fetch pokemon list:', error);
        // Fallback to placeholder names
        const pokemonList: PokemonEntry[] = Array.from({ length: 1025 }, (_, i) => ({
          id: i + 1,
          name: `Pokémon #${i + 1}`,
          imageUrl: getPokemonImageUrl(i + 1),
          guessed: guessedPokemonIds.has(i + 1),
        }));
        setPokemon(pokemonList);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, [user?.id]);

  const filteredPokemon = pokemon.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString() === searchTerm;
    const matchesFilter = !guessedOnly || p.guessed;
    const matchesGen = selectedGeneration === 'all' || getGenerationFromId(p.id) === selectedGeneration;
    return matchesSearch && matchesFilter && matchesGen;
  });

  const guessedCount = pokemon.filter((p) => p.guessed).length;

  return (
    <GameContainer>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8 px-4 sm:px-0">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm sm:text-base"
        >
          <ChevronLeft size={18} className="sm:w-[20px] sm:h-[20px]" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent order-first sm:order-none">
          Pokédex
        </h1>
        <div className="text-xs sm:text-sm text-slate-400">{guessedCount}/{pokemon.length}</div>
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8 space-y-3 sm:space-y-4 px-4 sm:px-0"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 sm:py-3 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 focus:outline-none rounded-lg text-sm sm:text-base text-white placeholder-slate-500 transition-all duration-300"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setGuessedOnly(!guessedOnly)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
              guessedOnly
                ? 'bg-green-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {guessedOnly ? '✓ Guessed Only' : 'Show All'}
          </button>

          <select
            value={selectedGeneration}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedGeneration(val === 'all' ? 'all' : Number(val));
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-blue-500 focus:outline-none rounded-lg text-sm sm:text-base text-slate-300 hover:text-white font-medium transition-all duration-300 cursor-pointer"
          >
            {generations.map((gen) => (
              <option key={gen.value} value={gen.value} className="bg-slate-900 text-slate-300">
                {gen.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Pokemon Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : filteredPokemon.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-slate-400 text-lg">No Pokémon found</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 px-4 sm:px-0"
        >
          {filteredPokemon.map((p, index) => (
            <div key={p.id} className="aspect-[3/4]">
              <PokemonCard
                id={p.id}
                name={p.name}
                imageUrl={p.imageUrl}
                guessed={p.guessed}
                index={index}
              />
            </div>
          ))}
        </motion.div>
      )}
    </GameContainer>
  );
}
