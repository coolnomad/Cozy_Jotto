import React, { useState, useEffect } from 'react';

// Common 5-letter words for the game
const WORD_LIST = [
  'APPLE', 'BREAD', 'CHAIR', 'DANCE', 'EAGLE', 'FLAME', 'GRAPE', 'HEART',
  'IMAGE', 'JUICE', 'KNIFE', 'LEMON', 'MUSIC', 'NIGHT', 'OCEAN', 'PEACE',
  'QUIET', 'RIVER', 'STONE', 'TABLE', 'UNDER', 'VOICE', 'WATER', 'YOUTH',
  'BEACH', 'CLOUD', 'DREAM', 'EARTH', 'FRESH', 'GREEN', 'HOUSE', 'LIGHT',
  'MAGIC', 'NOVEL', 'PLANT', 'SMILE', 'SWEET', 'TRUST', 'WORLD', 'HAPPY'
];

// Valid 5-letter words for validation (expanded list)
const VALID_WORDS = new Set([
  ...WORD_LIST,
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT',
  'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT',
  'ALIGN', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'ANGEL',
  'ANGER', 'ANGLE', 'ANGRY', 'APART', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY',
  'ASIDE', 'ASSET', 'AUDIO', 'AVOID', 'AWAKE', 'AWARD', 'AWARE', 'BADLY',
  'BAKER', 'BASES', 'BASIC', 'BASIN', 'BASIS', 'BEAST', 'BEGIN', 'BEING',
  'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLAME', 'BLANK', 'BLIND', 'BLOCK',
  'BLOOD', 'BOARD', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BRAVE',
  'BREAK', 'BREED', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD',
  'CARGO', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAOS', 'CHARM', 'CHART',
  'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE',
  'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLICK', 'CLIMB', 'CLOCK', 'CLOSE',
  'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH',
  'CRAZY', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CURVE',
  'CYCLE', 'DAILY', 'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DELTA', 'DENSE',
  'DEPTH', 'DOING', 'DOUBT', 'DRAFT', 'DRAMA', 'DRANK', 'DRAWN', 'DRESS',
  'DRILL', 'DRINK', 'DRIVE', 'DROVE', 'DYING', 'EARLY', 'EIGHT', 'ELITE',
  'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT',
  'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER',
  'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLASH',
  'FLEET', 'FLOOR', 'FLUID', 'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM',
  'FOUND', 'FRAME', 'FRANK', 'FRAUD', 'FRONT', 'FRUIT', 'FULLY', 'FUNNY',
  'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GOING', 'GRACE', 'GRADE', 'GRAIN',
  'GRAND', 'GRANT', 'GRASS', 'GREAT', 'GROSS', 'GROUP', 'GROWN', 'GUARD',
  'GUESS', 'GUEST', 'GUIDE', 'GUILD', 'HAPPY', 'HARRY', 'HARSH', 'HASTE',
  'HEAVY', 'HENCE', 'HENRY', 'HORSE', 'HOTEL', 'HUMAN', 'IDEAL', 'INDEX',
  'INNER', 'INPUT', 'INTRO', 'ISSUE', 'JAPAN', 'JIMMY', 'JOINT', 'JONES',
  'JUDGE', 'KNOWN', 'LABEL', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER',
  'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEVEL', 'LEWIS', 'LIMIT',
  'LINKS', 'LIVES', 'LOCAL', 'LOGIC', 'LOOSE', 'LOWER', 'LUCKY', 'LUNCH',
  'LYING', 'MAJOR', 'MAKER', 'MARCH', 'MARIA', 'MATCH', 'MAYBE', 'MAYOR',
  'MEANT', 'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL',
  'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVIE',
  'NEEDS', 'NEVER', 'NEWLY', 'NINTH', 'NOBLE', 'NOISE', 'NORTH', 'NOTED',
  'NURSE', 'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'ORDER', 'OTHER', 'OUGHT',
  'PAINT', 'PANEL', 'PANIC', 'PAPER', 'PARTY', 'PASTA', 'PATCH', 'PEACE',
  'PENNY', 'PHASE', 'PHONE', 'PHOTO', 'PIECE', 'PILOT', 'PITCH', 'PLACE',
  'PLAIN', 'PLANE', 'PLANS', 'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS',
  'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROUD',
  'PROVE', 'QUEEN', 'QUEST', 'QUICK', 'QUIET', 'QUITE', 'QUOTE', 'RADIO',
  'RAISE', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY', 'REALM', 'REFER',
  'RELAX', 'REPLY', 'RIGHT', 'RIVAL', 'ROMAN', 'ROUGH', 'ROUND', 'ROUTE',
  'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE',
  'SEVEN', 'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEET', 'SHELF', 'SHELL',
  'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT', 'SHOWN', 'SIGHT',
  'SINCE', 'SIXTH', 'SIXTY', 'SIZED', 'SKILL', 'SLEEP', 'SLIDE', 'SMALL',
  'SMART', 'SMITH', 'SMOKE', 'SOLID', 'SOLVE', 'SORRY', 'SOUND', 'SOUTH',
  'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT', 'SPLIT', 'SPOKE',
  'SPORT', 'STAFF', 'STAGE', 'STAKE', 'STAND', 'START', 'STATE', 'STEAM',
  'STEEL', 'STICK', 'STILL', 'STOCK', 'STORE', 'STORM', 'STORY', 'STRIP',
  'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SWEET',
  'TABLE', 'TAKEN', 'TASTE', 'TAXES', 'TEACH', 'TERMS', 'TEXAS', 'THANK',
  'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK',
  'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'TIGHT', 'TIMES', 'TITLE',
  'TODAY', 'TOPIC', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE',
  'TRAIN', 'TRASH', 'TREAT', 'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED',
  'TRIES', 'TROOP', 'TRUCK', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TWICE',
  'UNDER', 'UNDUE', 'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN',
  'USAGE', 'USUAL', 'VALID', 'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL',
  'VOCAL', 'VOICE', 'WASTE', 'WATCH', 'WATER', 'WHEEL', 'WHERE', 'WHICH',
  'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY',
  'WORSE', 'WORST', 'WORTH', 'WOULD', 'WOUND', 'WRITE', 'WRONG', 'WROTE',
  'YIELD', 'YOUNG', 'YOURS', 'YOUTH', 'ZONES', 'PORES', 'PEACH', 'PLUM'
]);

const JottoGame = () => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setTargetWord(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
    setError('');
  };

  const countMatchingLetters = (guess, target) => {
    const targetLetters = target.split('');
    const guessLetters = guess.split('');
    let count = 0;
    
    guessLetters.forEach(letter => {
      const index = targetLetters.indexOf(letter);
      if (index !== -1) {
        count++;
        targetLetters[index] = null; // Remove to handle duplicates
      }
    });
    
    return count;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const guess = currentGuess.toUpperCase().trim();
    
    if (guess.length !== 5) {
      setError('Word must be 5 letters');
      return;
    }
    
    if (!VALID_WORDS.has(guess)) {
      setError('Not a valid word');
      return;
    }
    
    if (guesses.some(g => g.word === guess)) {
      setError('Already guessed this word');
      return;
    }
    
    const matches = countMatchingLetters(guess, targetWord);
    const newGuesses = [...guesses, { word: guess, matches }];
    setGuesses(newGuesses);
    setCurrentGuess('');
    
    if (guess === targetWord) {
      setWon(true);
      setGameOver(true);
    } else if (newGuesses.length >= 10) {
      setGameOver(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-serif text-amber-900 mb-2">Jotto</h1>
          <p className="text-amber-700 text-sm">Guess the 5-letter word</p>
        </div>

        {/* Main Game Card */}
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-8 border-2 border-amber-100">
          {/* Instructions */}
          <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <p className="text-amber-900 text-sm leading-relaxed">
              💡 <strong>How to play:</strong> Guess the hidden 5-letter word in 10 tries. 
              Each guess shows how many letters match the hidden word (including duplicates).
            </p>
          </div>

          {/* Guess Counter */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-6 py-2 rounded-full">
              <span className="text-orange-900 font-semibold">
                Guesses: {guesses.length}/10
              </span>
            </div>
          </div>

          {/* Input Form */}
          {!gameOver && (
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentGuess}
                  onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
                  maxLength={5}
                  className="flex-1 px-4 py-3 text-lg font-semibold tracking-widest uppercase text-center border-2 border-amber-300 rounded-xl focus:outline-none focus:border-orange-400 bg-white"
                  placeholder="GUESS"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-orange-400 to-red-400 text-white font-semibold rounded-xl hover:from-orange-500 hover:to-red-500 transition-all shadow-md"
                >
                  Submit
                </button>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
              )}
            </form>
          )}

          {/* Guesses List */}
          <div className="space-y-2 mb-6">
            {guesses.map((guess, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
              >
                <span className="text-xl font-bold tracking-widest text-amber-900">
                  {guess.word}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-amber-700">matches:</span>
                  <span className="bg-orange-400 text-white font-bold px-4 py-1 rounded-full text-lg min-w-[3rem] text-center">
                    {guess.matches}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Game Over Messages */}
          {gameOver && (
            <div className="text-center space-y-4">
              {won ? (
                <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-300">
                  <div className="text-5xl mb-2">🎉</div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">
                    Congratulations!
                  </h2>
                  <p className="text-green-700">
                    You found the word in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}!
                  </p>
                </div>
              ) : (
                <div className="p-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl border-2 border-red-300">
                  <div className="text-5xl mb-2">😔</div>
                  <h2 className="text-2xl font-bold text-red-800 mb-2">
                    Game Over
                  </h2>
                  <p className="text-red-700">
                    The word was: <strong className="text-2xl">{targetWord}</strong>
                  </p>
                </div>
              )}
              <button
                onClick={startNewGame}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-amber-700 text-sm">
          <p>☕ Perfect for a cozy word game session</p>
        </div>
      </div>
    </div>
  );
};

export default JottoGame;