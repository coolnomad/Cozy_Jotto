const DATAMUSE_ENDPOINT = 'https://api.datamuse.com/words';
const VALIDATION_CACHE = new Map();

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Dictionary request failed: ${response.status}`);
  }
  return response.json();
}

export async function isDictionaryWord(word) {
  const key = word.toUpperCase();
  if (VALIDATION_CACHE.has(key)) {
    return VALIDATION_CACHE.get(key);
  }

  const params = new URLSearchParams({
    sp: key,
    max: '1',
  });

  try {
    const data = await fetchJson(`${DATAMUSE_ENDPOINT}?${params.toString()}`);
    const isValid = Array.isArray(data)
      && data.length > 0
      && typeof data[0]?.word === 'string'
      && data[0].word.toUpperCase() === key;

    VALIDATION_CACHE.set(key, isValid);
    return isValid;
  } catch (error) {
    console.warn('Dictionary validation failed, falling back to local list.', error);
    return null;
  }
}

