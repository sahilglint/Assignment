import React, { useEffect, useState } from 'react';
import TwoColumnRow from '../components/blocks/TwoColumnRow';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Landingpage2({ initialLayout = [] }) {
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('twoColumnRowData');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLayout([{ type: 'twoColumn', props: parsed }]);
    } else {
      setLayout(initialLayout);

      if (initialLayout.length > 0 && initialLayout[0].props) {
        localStorage.setItem('twoColumnRowData', JSON.stringify(initialLayout[0].props));
      }
    }
  }, [initialLayout]);

  return (
    <div className="p-4 relative">
      {layout.length === 0 ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        layout.map((block, i) => {
          if (block.type === 'twoColumn') {
            const key = `${block.props.heading}-${block.props.subtitle}-${block.props.cta}`;
            return (
              <div key={key} className="relative group">
                <TwoColumnRow />
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
            landingPageCollection(where: { slug: "page-2" }, limit: 1) {
              items {
                layoutCollection {
                  items {
                    __typename
                    ... on TwoColumnRow {
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
    .filter((b) => b.__typename === 'TwoColumnRow')
    .map((b) => ({
      type: 'twoColumn',
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
