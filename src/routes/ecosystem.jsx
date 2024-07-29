import { useState, useEffect } from 'react'
import { useLoaderData, defer, Form, Await, useRouteError, Link, useNavigate } from 'react-router-dom'
import { useAuth, web3, _, contract } from '../contexts/AuthContext'
import { Title } from './helper/DocumentTitle'
import styles from './Ecosystem.module.scss'

export default function Ecosystem({ title }) {
  Title(title)
  const [loaderData, setLoaderData] = useState(useLoaderData())
  const [isLoading, setIsLoading] = useState(true)
  const [ecosystem, setEcosystem] = useState([
    {
      name: `LUKSO`,
      description: `LUKSO is a blockchain platform designed specifically for the creative industries. It aims to provide a foundation for the new digital lifestyle, encompassing fashion, gaming, design, and social media.`,
      cover: `QmRCaxHrZPDYtgCN9XwsK2qEZvdeVQTPbpszX2f95RW62H`,
    },
    {
      name: `Arbitrum`,
      description: `Arbitrum is a Layer 2 scaling solution built on top of the Ethereum blockchain. It aims to improve the scalability and speed of Ethereum while maintaining its security.`,
      cover: `QmXpCPQjDYJftzjsD7HzmiTkz8gutEQXZVUm6NYNAEwtqb`,
    },
  ])

  return (
    <section className={styles.section}>
      <div className={`${styles['page-hero']} ms-motion-slideUpIn`}>
        <div className={`__container`} data-width={`large`}>
          <h2> Our Ecosystem</h2>
          <p>Building a Better Together</p>
        </div>
      </div>

      <div className={`${styles['container']} __container ms-motion-slideUpIn`} data-width={`large`}>
        <div className="grid grid--fit" style={{ '--data-width': `300px`, gap: `1rem` }}>
          {ecosystem &&
            ecosystem.length > 0 &&
            ecosystem.map((item, i) => {
              return (
                <div className={`${styles['card']}`}>
                  <figure>
                    <img src={`https://ipfs.io/ipfs/${item.cover}`} />
                  </figure>
                  <div className={`${styles['card__body']}`}>
                    <h1>{item.name}</h1>
                    <p>{item.description}</p>
                  </div>
                </div>
              )
            })}
        </div>

        <article>
          <p>Dropid is at the forefront of Web3 usernames, built on the solid foundation of LUKSO's Limited Supply Protocol (LSP). This allows users to own unique, tradable, and verifiable digital identities. </p>

          <p>We're excited to announce our expansion beyond LUKSO to create a truly interoperable Web3 username ecosystem. Our first step is integrating with Arbitrum, a leading Layer 2 scaling solution. </p>

          <p>
            By expanding to Arbitrum, we're increasing accessibility, enhancing performance, and unlocking new possibilities for Dropid usernames. Our vision is a future where Dropid usernames are universally recognized and valued across multiple
            blockchains.{' '}
          </p>

          <p>Stay tuned for updates as we shape the future of Web3 identity. </p>
        </article>
      </div>
    </section>
  )
}
