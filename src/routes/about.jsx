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
      <div className={`${styles['container']} __container ms-motion-slideUpIn`} data-width={`xxlarge`}>
        <div className={`__container`} data-width={`large`}>
<article>
<p>Your Dropid username is more than just an address on the blockchain; it&#39;s your digital identity on Web3. With Dropid, you can:</p>

<ul>
  <li>
    <strong>Own a unique and memorable username:</strong> Ditch the long and cryptic wallet addresses. Claim your personalized Dropid and make it easy for others to find you.
  </li>
  <li>
    <strong>Showcase your profile with ease:</strong> Integrate your Dropid username with Telegram&#39;s Universal Profile Bot. When someone sends their Dropid username to the bot, your profile information stored on the LUKSO blockchain
    will be instantly retrieved, showcasing your digital presence.
  </li>
  <li>
    <strong>Seamlessly send and receive funds:</strong> Sending and receiving funds on Web3 is about to get easier. We&#39;re developing a dedicated page where you can send funds using your Dropid username, complete with multi-send
    functionality for added convenience.
  </li>
</ul>

<p>
  <strong>Here&#39;s a quick guide on how to get started:</strong>
</p>

<ol>
  <li>
    <strong>Mint your Dropid username:</strong> Visit the main page of our DApp and follow the simple steps to mint your unique username.
  </li>
  <li>
    <strong>Integrate with Telegram:</strong> Follow the instructions provided to connect your Dropid username with Telegram&#39;s Universal Profile Bot.
  </li>
  <li>
    <strong>Start using your Dropid:</strong> Share your Dropid username with friends, colleagues, and online communities. Let them discover your Web3 profile with a single click.
  </li>
</ol>

<b>Stay tuned!</b>
</article>
        </div>

        <div className="grid grid--fit" style={{ '--data-width': `200px`, columnGap: `1rem`, rowGap: '1rem' }}>
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
      </div>
    </section>
  )
}
