// Single source of truth for every design. Edit facts here once.
import stats from './stats.json';

export { stats };

export const profile = {
  name: 'Ashutosh Lodha',
  first: 'Ashutosh',
  role: 'Software Engineer',
  tagline: 'I build cloud-native platforms and distributed backends — and keep them running in production.',
  email: 'lodhaashutosh@gmail.com',
  location: 'India · IST (UTC+5:30)',
  status: 'Open to SDE, backend & platform roles — on-site, hybrid or remote',
  cert: {
    name: 'AWS Certified Solutions Architect – Associate',
    short: 'AWS SAA',
    url: 'https://www.credly.com/badges/d2f251dc-fdd6-4b48-868a-3f3438753a8f/public_url',
    img: '/work/aws-saa.png',
  },
};

export const links = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ashutosh-lodha/' },
  { label: 'GitHub', url: 'https://github.com/ashutosh-lodha' },
  { label: 'LeetCode', url: 'https://leetcode.com/u/flsEPqZ27o/' },
  { label: 'Email', url: 'mailto:lodhaashutosh@gmail.com' },
];

// The story, in order. Every design walks through these chapters.
export const chapters = [
  {
    id: 'hello', no: '00', name: 'Hello', pose: 'wave',
    title: 'Hi, I’m Ashutosh.',
    bubble: 'Hey! I’m Ashutosh. Scroll with me 👇',
    body: [
      'A software engineer who builds cloud-native platforms and distributed backends — and keeps them running in production.',
      'This page is my story. Scroll and I’ll walk you through it.',
    ],
    chips: ['AWS Certified Solutions Architect', 'Shipped DataDrop & UptimeHQ', 'India · IST'],
  },
  {
    id: 'roots', no: '01', name: 'Roots', pose: 'walk',
    title: 'It started in the hills.',
    bubble: 'Dehradun, 2020. Mountains + cloud computing 🏔️',
    body: [
      'I grew up in the GAIL township at Vijaipur and finished school there in 2020, then packed a bag for UPES, Dehradun.',
      'B.Tech in Computer Science with a specialisation in Cloud Computing & Virtualization. Graduated in 2024 with a CGPA of 8.35, and joined the Cloud Security Alliance chapter on campus.',
    ],
    facts: [['2020–24', 'B.Tech CSE'], ['8.35', 'CGPA'], ['Cloud', 'Specialisation']],
  },
  {
    id: 'first', no: '02', name: 'First code', pose: 'type',
    title: 'Shipping for real people.',
    bubble: 'My first code for real users ⌨️',
    body: ['Two internships, two very different problems — and my first code in the hands of real users.'],
    roles: [
      {
        when: 'Jun – Jul 2022', where: 'Vijaipur', org: 'GAIL (India) Ltd', title: 'Summer Intern',
        text: 'Built Tourney — one place for college clubs to publish events and for students to register. Session auth, REST APIs and tuned MongoDB schemas.',
        tags: ['Node.js', 'Express', 'MongoDB', 'Passport'],
      },
      {
        when: 'Jun – Aug 2023', where: 'Remote', org: 'HERE Technologies', title: 'Python Developer Intern',
        text: 'On the Spyder project I built Scrapy and BeautifulSoup crawlers that collected geolocation data from many sources and shaped it into GeoJSON for mapping.',
        tags: ['Python', 'Scrapy', 'BeautifulSoup', 'GeoJSON'],
      },
    ],
  },
  {
    id: 'detective', no: '03', name: 'Detective years', pose: 'inspect',
    title: 'Reading code like evidence.',
    bubble: 'Two years reading other people’s code 🔍',
    body: [
      'Jan 2024 – Dec 2025: Research Analyst at Copperpod IP, Mohali. I opened up real-world source code and hardware and proved — line by line — whether it does what a patent claims.',
      'Infringement and prior-art claim charts, patent portfolio analysis and technical memos for legal teams. It taught me to read unfamiliar codebases fast and back every conclusion with evidence.',
    ],
  },
  {
    id: 'cloud', no: '04', name: 'Into the cloud', pose: 'float',
    title: 'Up, up & certified.',
    bubble: 'Certified. Head in the cloud ☁️',
    body: ['I went deep on AWS — core services, high availability, networking, security and cost optimisation — and earned the AWS Certified Solutions Architect – Associate.'],
    tools: ['AWS', 'Kubernetes', 'Docker', 'Helm', 'Terraform', 'Cloudflare', 'Nginx', 'GitHub Actions', 'ArgoCD', 'Linux', 'Go', 'TypeScript', 'Node.js', 'Python', 'React', 'PostgreSQL', 'Redis', 'MySQL', 'MongoDB', 'Prometheus', 'Grafana'],
  },
  {
    id: 'builds', no: '05', name: 'The builds', pose: 'point',
    title: 'Things I built & run.',
    bubble: 'Walk with me — these are mine 🏙️',
    body: ['Designed, written, deployed and kept alive by me. Live dots are real — your browser is pinging them right now.'],
  },
  {
    id: 'gym', no: '06', name: 'Training', pose: 'lift',
    title: 'Reps, every single day.',
    bubble: `${stats.leetcode.total} and counting 💪`,
    body: ['Data structures and algorithms are my daily workout — tracked on LeetCode and auto-synced to GitHub.'],
  },
  {
    id: 'contact', no: '07', name: 'Your turn', pose: 'cheer',
    title: 'The next chapter could be with you.',
    bubble: 'Your turn — say hi! ☕',
    body: ['I’m looking for an SDE, backend or platform engineering role on a team that cares about reliability as much as features.'],
  },
];

export const projects = [
  {
    id: 'datadrop', no: '01', name: 'DataDrop', year: '2026', role: 'Founder & Engineer',
    color: '#7c6cff',
    lede: 'Privacy-first cloud storage, billed only for the gigabytes you keep.',
    points: [
      'Runs entirely on Cloudflare Workers — no origin servers, every request served from the nearest edge.',
      'Zero-knowledge Vault: per-file AES-256-GCM keys wrapped with the user’s ECDH P-256 key.',
      '₹1.49/GB pay-as-you-go via Razorpay UPI AutoPay with hourly reconciliation.',
    ],
    stack: ['Cloudflare Workers', 'React', 'Backblaze B2', 'WebCrypto', 'Razorpay'],
    live: 'https://datadrop.co.in',
    source: 'https://github.com/ashutosh-lodha/datadrop-storage',
    shot: '/work/datadrop-hero.jpg',
  },
  {
    id: 'uptimehq', no: '02', name: 'UptimeHQ', year: '2026', role: 'Design · Build · Operate',
    color: '#2fd17a',
    lede: 'Know the moment a site goes down — self-hosted uptime monitoring for sites and APIs.',
    points: [
      'Separate API, worker and scheduler over a BullMQ queue — checks as often as every 5 seconds.',
      'Incident lifecycle with email alerts, SSRF protection and encrypted monitor credentials.',
      '107 tests in CI, images on GHCR, continuously deployed behind Nginx + HTTPS.',
    ],
    stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis · BullMQ', 'Docker', 'Nginx'],
    live: 'https://uptimehq.ashutoshdev.online',
    source: 'https://github.com/ashutosh-lodha/UptimeHQ',
    shot: '/work/uptimehq-landing.png',
  },
  {
    id: 'idp', no: '03', name: 'Mini IDP', year: '2026', role: 'Platform engineering',
    color: '#3aa0ff',
    lede: 'An internal developer platform: deploy any Docker image or GitHub repo to Kubernetes from one screen.',
    points: [
      'Helm-based deploys; GitHub webhooks clone, build and roll out on every push.',
      'Live logs, exec into containers, per-pod metrics, scaling and one-click rollback.',
      'A diagnosis engine reads pod state + logs and names the root cause and fix.',
    ],
    stack: ['Go', 'Kubernetes', 'Helm', 'Docker', 'Cloudflared'],
    source: 'https://github.com/ashutosh-lodha/idp-platform',
    shot: '/work/idp-dashboard.png',
  },
  {
    id: 'gate', no: '04', name: 'Rate Gate', year: '2026', role: 'Distributed systems',
    color: '#ff8a3d',
    lede: 'A distributed API gateway with per-key rate limiting, async analytics and autoscaling.',
    points: [
      'Sliding-window rate limiting per API key in Redis, shared across replicas.',
      'Async request logging via Redis Streams into a MySQL analytics worker.',
      'Kubernetes HPA autoscaling with Prometheus metrics and Grafana dashboards.',
    ],
    stack: ['Go', 'Redis Streams', 'MySQL', 'Kubernetes', 'Prometheus', 'Grafana'],
    source: 'https://github.com/ashutosh-lodha/api-gateway-rate-limiter',
    shot: '/work/gateway.png',
  },
];
