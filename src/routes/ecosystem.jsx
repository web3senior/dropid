import { Title } from './helper/DocumentTitle'
import styles from './Ecosystem.module.scss'

export default function Ecosystem({ title }) {
  Title(title)

  return (
    <section className={styles.section}>
      <div className={`${styles['alert']} ms-motion-slideUpIn`}>
        <div className={`__container`} data-width={`large`}>
          <h2>Alpha version</h2>
          <p>Built on LUKSO, Reaching Beyond</p>
        </div>
      </div>
      <div className={`${styles['container']} __container ms-motion-slideUpIn`} data-width={`large`}>
        <article className={`text-justify`}>
          <h3>Built on LUKSO, Reaching Beyond</h3>

          <p>
            Dropid is proud to be a pioneering project in the Web3 username space, built on the robust foundation of LUKSO. By leveraging LUKSO&#39;s Limited Supply Protocol (LSP), we&#39;ve created a platform where users can own unique, tradeable,
            and verifiable digital identities.
          </p>

          <p>Our commitment to innovation and user experience drives us to continually explore new opportunities.</p>

          <h3>Expanding Horizons</h3>

          <p>We are excited to announce our expansion plans to support additional blockchains beyond LUKSO. Our goal is to create a truly interoperable Web3 username ecosystem.</p>

          <p>
            <strong>Arbitrum and Beyond:</strong>
          </p>

          <p>Our roadmap includes integrating with Arbitrum, a leading Layer 2 scaling solution, to offer users even more flexibility and scalability. By expanding our ecosystem, we aim to:</p>

          <ul>
            <li>
              <strong>Increase accessibility:</strong> Make Dropid usernames available to a wider audience.
            </li>
            <li>
              <strong>Enhance performance:</strong> Improve transaction speeds and reduce costs.
            </li>
            <li>
              <strong>Expand utility:</strong> Unlock new possibilities for Dropid usernames across different platforms and applications.
            </li>
          </ul>

          <h3>A Unified Web3 Identity</h3>

          <p>
            Our vision is to create a future where Dropid usernames are recognized and valued across multiple blockchains. By building a strong foundation on LUKSO and strategically expanding our ecosystem, we are committed to delivering a seamless
            and user-centric experience.
          </p>

          <p>
            <strong>Stay tuned for updates as we embark on this exciting journey.</strong>
          </p>
        </article>
      </div>
    </section>
  )
}
