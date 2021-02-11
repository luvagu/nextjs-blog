import Head from 'next/head'

const Metatags = ({ 
    title = 'Simple Next.js Blog with Firebase',
    description = 'A complete Next.js Blog with Firebase by LuVaGu',
    image = 'https://avatars.githubusercontent.com/u/4513465?s=460&u=f8986596ee439311427e3779d5a7b817037f30d8&v=4',
}) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@luiavag" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
        </Head>
    )
}

export default Metatags
