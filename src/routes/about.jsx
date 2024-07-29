import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import Heading from './helper/Heading'
import styles from './About.module.scss'

export default function About({ title }) {
  Title(title)

  const [faq, setFaq] = useState([
    {
      q: `What is Dropid.name?`,
      a: `Dropid.name is a platform that allows users to mint and own unique Web3 usernames on the LUKSO blockchain. These usernames can be used across various platforms and applications.`,
    },
    {
      q: `How do I get a Dropid username?`,
      a: `You can acquire a Dropid username by purchasing it directly from the marketplace or participating in auctions.`,
    },
    {
      q: `What can I do with my Dropid username?`,
      a: `Currently, you can use your Dropid username on Telegram by connecting it to the Universal Profile Bot. Future integrations will allow you to send funds and potentially access other Web3 services.`,
    },
    {
      q: `Is my Dropid username secure?`,
      a: `Yes, Dropid usernames are stored securely on the LUKSO blockchain, providing a high level of security.`,
    },
  ])
  useEffect(() => {}, [])

  return (
    <section className={styles.section}>
      <div className={`${styles['page-hero']} ms-motion-slideUpIn`}>
        <div className={`__container`} data-width={`large`}>
          <h2> About Us</h2>
          <p>Shaping the Future of Web3 Identities</p>
        </div>
      </div>

      <div className={`__container`} data-width={`large`}>
        <article>
          <p>
            We believe everyone deserves a unique and ownable presence in the digital world. Dropid empowers users to claim their identity with a personalized Web3 username. Built on the robust LUKSO blockchain, we offer secure, tradeable, and
            verifiable digital identities.
          </p>{' '}
          <p>
            Dropid is a product of Aratta Labs, a team dedicated to pushing the boundaries of Web3. Our smart contract, built based on the{' '}
            <a href={`https://eips.ethereum.org/EIPS/eip-137`} target={`_blank`}>
              ERC-137 (Ethereum Domain Name Service)
            </a>{' '}
            Ethereum Improvement Proposals, underpins the core functionality of Dropid, enabling a decentralized and user-centric experience.
          </p>{' '}
          <p>Join us in shaping the future of the internet.</p>
        </article>

        <Heading title={`Roadmap`} subTitle={`Coming soon`}></Heading>
      </div>

      <div className={`${styles['container']} __container ms-motion-slideUpIn`} data-width={`xxlarge`}>
        <div className={`__container`} data-width={`large`}>
          <Heading title={`FAQs`} subTitle={`Frequently Asked Questions`}></Heading>
          {faq.map((item, i) => (
            <details className={`transition`} key={i}>
              <summary>{item.q}</summary>
              <div dangerouslySetInnerHTML={{ __html: item.a }} />
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
