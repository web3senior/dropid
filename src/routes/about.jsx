import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import Heading from './helper/Heading'
import styles from './About.module.scss'

export default function About({ title }) {
  Title(title)

  const [faq, setFaq] = useState([
    {
      q: `What is a decentralized form?`,
      a: `A decentralized form is a form that exists and operates on a blockchain. Unlike traditional forms that rely on centralized servers, decentralized forms are transparent, immutable, and resistant to censorship.`,
    },
    {
      q: `Why build a decentralized form like Typeform?`,
      a: `Decentralized forms offer several advantages over traditional ones:
<p><b>Transparency:</b> All form data is publicly accessible and verifiable.</p>
<p><b>Security:</b> Data is immutable and cannot be altered or deleted.</p>
<p><b>Censorship resistance:</b> Forms cannot be taken down or manipulated by a central authority.</p>
<p><b>Trustlessness:</b> No intermediary is required to manage the form or data.</p>
      `,
    },
    {
      q: `What blockchain should I use for my decentralized form?`,
      a: ` The choice of blockchain depends on various factors, including scalability, cost, and specific features. Popular options include LUKSO, Arbitrum, and Polygon.`,
    },
    {
      q: `How do I store form data on-chain?`,
      a: `Form data can be stored as smart contracts or as data within existing smart contracts. The choice depends on the complexity of the form and the desired level of interaction with the data.`,
    },
  ])
  useEffect(() => {

  }, [])

  return (
    <section className={styles.section}>
      <div className={`${styles['container']} __container ms-motion-slideUpIn`} data-width={`xxlarge`}>
        <div className="grid grid--fit" style={{ '--data-width': `200px`, columnGap: `1rem`, rowGap: '1rem' }}>
          <div className={`${styles['']} mt-100 w-100`}>
            <div className={`__container`} data-width={`xlarge`}>
              <Heading title={`FAQs`} subTitle={`Frequently Asked Questions`}></Heading>
              {faq.map((item, i) => (
                <details className={`transition`} key={i}>
                  <summary>{item.q}</summary>
                  <div dangerouslySetInnerHTML={{ __html: item.a }} />
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
