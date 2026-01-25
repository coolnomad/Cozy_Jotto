const DATAMUSE_ENDPOINT = 'https://api.datamuse.com/words';
const MAX_REQUESTS_PER_SECOND = 10;
const requestTimestamps = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function rateLimit() {
  const now = Date.now();
  const windowStart = now - 1000;
  while (requestTimestamps.length > 0 && requestTimestamps[0] < windowStart) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= MAX_REQUESTS_PER_SECOND) {
    const waitMs = 1000 - (now - requestTimestamps[0]);
    await sleep(Math.max(waitMs, 0));
    return rateLimit();
  }

  requestTimestamps.push(Date.now());
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Word fetch failed: ${response.status}`);
  }
  return response.json();
}

export async function fetchRandomZenWord() {
  await rateLimit();
  const params = new URLSearchParams({
    sp: '?????',
    max: '1000',
  });

  const data = await fetchJson(`${DATAMUSE_ENDPOINT}?${params.toString()}`);
  const uniqueLetterWords = data.filter(wordObj => (
    typeof wordObj.word === 'string'
    && wordObj.word.length === 5
    && new Set(wordObj.word.toUpperCase()).size === 5
  ));

  if (uniqueLetterWords.length === 0) {
    throw new Error('No suitable 5-letter words found.');
  }

  const choice = uniqueLetterWords[Math.floor(Math.random() * uniqueLetterWords.length)].word;
  return choice.toUpperCase();
}

