// Refreshes src/stats.json with live LeetCode + GitHub numbers at build time.
// If a source is unreachable the previous values are kept, so a build never fails on it.
import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../src/shared/stats.json', import.meta.url);
const LEETCODE_USER = 'flsEPqZ27o';
const GITHUB_USER = 'ashutosh-lodha';

const stats = JSON.parse(await readFile(FILE, 'utf8'));

async function leetcode() {
  const query = `query($u:String!){matchedUser(username:$u){profile{ranking} submitStatsGlobal{acSubmissionNum{difficulty count}} badges{displayName}}}`;
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
    body: JSON.stringify({ query, variables: { u: LEETCODE_USER } }),
    signal: AbortSignal.timeout(15000),
  });
  const { data } = await res.json();
  const u = data.matchedUser;
  const by = Object.fromEntries(u.submitStatsGlobal.acSubmissionNum.map((d) => [d.difficulty, d.count]));
  stats.leetcode = {
    total: by.All,
    easy: by.Easy,
    medium: by.Medium,
    hard: by.Hard,
    ranking: u.profile.ranking,
    badges: u.badges.map((b) => b.displayName),
  };
}

async function github() {
  const headers = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers, signal: AbortSignal.timeout(15000) });
  const u = await res.json();
  if (typeof u.public_repos === 'number') stats.github = { repos: u.public_repos };
}

for (const [name, fn] of [['leetcode', leetcode], ['github', github]]) {
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.warn(`! ${name} unavailable, keeping previous values (${err.message})`);
  }
}

stats.updated = new Date().toISOString().slice(0, 10);
await writeFile(FILE, JSON.stringify(stats, null, 2) + '\n');
console.log(stats);
