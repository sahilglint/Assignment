import React, { useState, useEffect } from 'react';
import HeroBlock from '../components/blocks/HeroBlock';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Landingpage1({ initialLayout = [] }) {
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('heroBlockData');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLayout([{ type: 'hero', props: parsed }]);
    } else {
      setLayout(initialLayout);

      if (initialLayout.length > 0 && initialLayout[0].props) {
        localStorage.setItem('heroBlockData', JSON.stringify(initialLayout[0].props));
      }
    }
  }, [initialLayout]);

  return (
    <div className="p-4 relative">
      {layout.length === 0 ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        layout.map((block, i) => {
          if (block.type === 'hero') {
            const key = `${block.props.heading}-${block.props.subtitle}-${block.props.cta}`;
            return (
              <div key={key} className="relative group">
                <HeroBlock
                  heading={block.props.heading}
                  subtitle={block.props.subtitle}
                  cta={block.props.cta}
                />
              </div>
            );
          }
          return null;
        })
      )}
      <ToastContainer position="top-center" />
    </div>
  );
}

export async function getStaticProps() {
  const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || 'xzeeq848ln0v';
  const ACCESS_TOKEN = process.env.CONTENTFUL_DELIVERY_TOKEN || 'edb_03lsmga3J9GfQ_lKQLrNgdQA7Jfm9KodncA5b7I';
  
  const res = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          query {
            landingPageCollection(where: { slug: "page-1" }, limit: 1) {
              items {
                layoutCollection {
                  items {
                    __typename
                    ... on HeroBlock {
                      heading
                      subtitle
                      cta
                    }
                  }
                }
              }
            }
          }
        `,
      }),
    }
  );

  const json = await res.json();
  const raw = json?.data?.landingPageCollection?.items?.[0]?.layoutCollection?.items || [];

  const layout = raw
    .filter((b) => b.__typename === 'HeroBlock')
    .map((b) => ({
      type: 'hero',
      props: {
        heading: b.heading || '',
        subtitle: b.subtitle || '',
        cta: b.cta || '',
      },
    }));

  return {
    props: { initialLayout: layout },
    revalidate: 60,
  };
}
