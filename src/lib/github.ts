const GITHUB_USERNAME = "ankush850";
const PORTFOLIO_TOPIC = "portfolio";
const CACHE_TTL_MS = 1 * 60 * 60 * 1000; // 1 hour

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  default_branch: string;
}

/** Read a cached value from localStorage if it hasn't expired. */
function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: T; ts: number };
    if (Date.now() - ts > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/** Write a value to localStorage with the current timestamp. */
function writeCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

/**
 * Fetches all public repos for ankush850 tagged with the "portfolio" topic.
 * Ankush can control which repos appear by adding/removing the topic on GitHub —
 * no code changes needed. Results are cached for 24 hours.
 */
export async function fetchPortfolioRepositories(): Promise<GitHubRepo[]> {
  const cacheKey = `gh_portfolio_v1_${GITHUB_USERNAME}_${PORTFOLIO_TOPIC}`;
  const cached = readCache<GitHubRepo[]>(cacheKey);
  if (cached) return cached;

  try {
    // GitHub Search API: returns all repos for a user with a specific topic
    const url = `https://api.github.com/search/repositories?q=user:${GITHUB_USERNAME}+topic:${PORTFOLIO_TOPIC}&sort=updated&order=desc&per_page=100`;
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) return [];
    const data = await res.json() as { items: GitHubRepo[] };
    const repos = data.items ?? [];
    writeCache(cacheKey, repos);
    return repos;
  } catch (error) {
    console.error("[GitHub API] Error fetching portfolio repositories:", error);
    return [];
  }
}

/** @deprecated Use fetchPortfolioRepositories() instead. Kept for backward-compat. */
export async function fetchLatestRepositories(_limit: number = 6): Promise<GitHubRepo[]> {
  return fetchPortfolioRepositories();
}

export async function fetchRepositoryDetails(repoName: string): Promise<GitHubRepo | null> {
  const cacheKey = `gh_detail_v2_${repoName}`;
  const cached = readCache<GitHubRepo>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`);
    if (!res.ok) return null;
    const data = await res.json() as GitHubRepo;
    writeCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("[GitHub API] Error fetching repository details:", error);
    return null;
  }
}

export async function fetchRepositoryReadme(repoName: string): Promise<string | null> {
  const cacheKey = `gh_readme_v2_${repoName}`;
  const cached = readCache<string>(cacheKey);
  if (cached) return cached;

  try {
    // Fetch via the raw githubusercontent to instantly get the raw markdown bypassing base64 decoding
    const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/main/README.md`);

    // Fallback to master if main doesn't exist
    if (res.status === 404) {
      const fallbackRes = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/master/README.md`);
      if (!fallbackRes.ok) return null;
      const text = await fallbackRes.text();
      writeCache(cacheKey, text);
      return text;
    }

    if (!res.ok) return null;
    const text = await res.text();
    writeCache(cacheKey, text);
    return text;
  } catch (error) {
    console.error("[GitHub API] Error fetching README for", repoName, error);
    return null;
  }
}
