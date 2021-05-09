<p align="center">
  <a href="https://nextjs-blog-pied-iota.vercel.app">
    <img src="Screenshot.png" height="220">
    <h1 align="center">Next Blog</h1>
  </a>
</p>

> Next.js / Firebase / Custom usernames / TypeScript

Full Stack `Simple Social Blog` that lets authors create content using custom usernames while other users can like posts.

------

## Main Features

- Hybrid pages featuring both `Static & Server Side Rendering` and `SEO`
- Static pages also feature `Incremental Static Regeneration`
- Server and Client side rendering for search and filters
- Optimized images
- Data is displayed in cards over a timeline
- Uses Tailwind CSS framework for styling
- Responsive design
- Progress bar indicator shown on page transitions
- Search news
- Filters included by provider or by dates range
- Cards likes system
- Only logged in users may like cards once
- Auth0 for user authentication

## Clonning this repo

If you'd like to clone this repo, you'd first need to setup a firebase `Pub/Sub Cloud Function` for the web scrapper background job (code found in the `functions` folder). Then open a FaunaDb [account](https://fauna.com/) and setup a database with two collections (news and likes) and get a server key. However, further tweaks are needed to pull the correct data for the various API endpoints, search & sort and likes. Setup necessary environment variables.

```bash
git clone https://github.com/luvagu/next-headlines-archiver.git

cd next-headlines-archiver

npm install

npm run dev
```

Deploy the scheduled crawler after setting up and liking to your firebase project

```bash
cd functions

npm run deploy
```

