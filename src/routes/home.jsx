import { Suspense, useState, useEffect, useRef } from 'react'
import { useLoaderData, defer, Form, Await, useRouteError, Link, useNavigate } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'

import Icon from './helper/MaterialIcon'
import Shimmer from './helper/Shimmer'
import { getTournamentList } from './../util/api'
import toast, { Toaster } from 'react-hot-toast'
import Heading from './helper/Heading'
import { useAuth, web3, _, contract, ABI } from './../contexts/AuthContext'
import Logo from './../../src/assets/logo.svg'
import Coin from './../../src/assets/coin.png'
import Slide1 from './../../src/assets/slide1.png'
import Slide2 from './../../src/assets/slide1.png'
import Puzzle from './../../src/assets/puzzle.svg'

import party from 'party-js'
import styles from './Home.module.scss'

party.resolvableShapes['coin'] = `<img src="${Coin}" style='width:24px'/>`

const WhitelistFactoryAddr = web3.utils.padLeft(`0x2`, 64)

export const loader = async () => {
  return defer({ key: 'val' })
}

function Home({ title }) {
  Title(title)
  const [loaderData, setLoaderData] = useState(useLoaderData())
  const [isLoading, setIsLoading] = useState(true)

  const [recordType, setRecordType] = useState([])
  const [taotlRecordType, setTotalRecordType] = useState(0)
  const [totalResolve, setTotalResolve] = useState(0)
  const [freeToRegister, setFreeToRegister] = useState(undefined)
  const [publicMintPrice, setPublicMintPrice] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [toggleCustom, setToggleCustom] = useState(false)
  const [selectedRecordType, setSelectedRecordType] = useState('')
  const [councilMintExpirationDate, setCouncilMintExpirationDate] = useState('')
  const [maxSupply, setMaxSupply] = useState(0)
  const [candySecondaryColor, setCandySecondaryColor] = useState('#0E852E')
  const auth = useAuth()
  const navigate = useNavigate()
  const txtSearchRef = useRef()
  const recordTypeRef = useRef()

  const addMe = async () => {
    const t = toast.loading(`Loading`)
    try {
      web3.eth.defaultAccount = auth.wallet

      const whitelistFactoryContract = new web3.eth.Contract(ABI, import.meta.env.VITE_WHITELISTFACTORY_CONTRACT_MAINNET, {
        from: auth.wallet,
      })
      console.log(whitelistFactoryContract.defaultChain, Date.now())
      await whitelistFactoryContract.methods
        .addUser(WhitelistFactoryAddr)
        .send()
        .then((res) => {
          console.log(res)
          toast.dismiss(t)
          toast.success(`You hav been added to the list.`)
          party.confetti(document.querySelector(`h4`), {
            count: party.variation.range(20, 40),
          })
        })
    } catch (error) {
      console.error(error)
      toast.dismiss(t)
    }
  }

  const addUserByManager = async () => {
    const t = toast.loading(`Loading`)
    try {
      web3.eth.defaultAccount = auth.wallet

      const whitelistFactoryContract = new web3.eth.Contract(ABI, import.meta.env.VITE_WHITELISTFACTORY_CONTRACT_MAINNET, {
        from: auth.wallet,
      })

      await whitelistFactoryContract.methods
        .addUserByManager(WhitelistFactoryAddr)
        .send()
        .then((res) => {
          console.log(res)
          toast.dismiss(t)
          toast.success(`You hav been added to the list.`)
          party.confetti(document.querySelector(`h4`), {
            count: party.variation.range(20, 40),
          })
        })
    } catch (error) {
      console.error(error)
      toast.dismiss(t)
    }
  }

  const updateWhitelist = async () => {
    web3.eth.defaultAccount = `0x188eeC07287D876a23565c3c568cbE0bb1984b83`

    const whitelistFactoryContract = new web3.eth.Contract('', `0xc407722d150c8a65e890096869f8015D90a89EfD`, {
      from: '0x188eeC07287D876a23565c3c568cbE0bb1984b83', // default from address
      gasPrice: '20000000000',
    })
    console.log(whitelistFactoryContract.defaultChain, Date.now())
    await whitelistFactoryContract.methods
      .updateWhitelist(web3.utils.utf8ToBytes(1), `q1q1q1q1`, false)
      .send()
      .then((res) => {
        console.log(res)
      })
  }

  const createWhitelist = async () => {
    console.log(auth.wallet)
    web3.eth.defaultAccount = auth.wallet

    const whitelistFactoryContract = new web3.eth.Contract(ABI, import.meta.env.VITE_WHITELISTFACTORY_CONTRACT_MAINNET)
    await whitelistFactoryContract.methods
      .addWhitelist(``, Date.now(), 1710102205873, `0x0D5C8B7cC12eD8486E1E0147CC0c3395739F138d`, [])
      .send({ from: auth.wallet })
      .then((res) => {
        console.log(res)
      })
  }

  const handleSearch = async () => {
    if (txtSearchRef.current.value.length < 3) {
      toast.error(`A name must be a minimum of 3 characters long.`)
      return
    }

    const t = toast.loading(`Searching`)

    contract.methods
      .toNodehash(txtSearchRef.current.value, selectedRecordType)
      .call()
      .then(async (res) => {
        console.log(res)
        await contract.methods
          ._freeToRegister(res)
          .call()
          .then((res) => {
            console.log(res)
            setFreeToRegister(!res)
            toast.dismiss(t)
          })
      })
  }

  const fetchIPFS = async (CID) => {
    try {
      const response = await fetch(`https://api.universalprofile.cloud/ipfs/${CID}`)
      if (!response.ok) throw new Response('Failed to get data', { status: 500 })
      const json = await response.json()
      // console.log(json)
      return json
    } catch (error) {
      console.error(error)
    }

    return false
  }

  const getRecordType = async () => await contract.methods.getRecordTypeNameList().call()
  const getTotalRecordType = async () => await contract.methods._recordTypeCounter().call()
  const getTotalResolve = async () => await contract.methods._resolveCounter().call()
  const getResolveList = async (wallet) => await contract.methods.getResolveList(wallet).call()
  const getResolver = async () => await contract.methods.resolver(`0x7e058f5786c9fdc2c31ddd04421693cd9d671250e80405da9a2d85a37ffae6a7`).call()
  const getCouncilMintExpiration = async () => await contract.methods.councilMintExpiration().call()
  const getMaxSupply = async () => await contract.methods.MAX_SUPPLY().call()

  const rAsset = async (imageURL) => {
    const assetBuffer = await fetch(imageURL).then(async (response) => {
      return response.arrayBuffer().then((buffer) => new Uint8Array(buffer))
    })

    return assetBuffer
  }

  const generateImageUrl = async (domain) => {
    let svg = `<svg width="1080" height="1080" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes stroke{0%{fill:rgba(252, 114, 255, 0);stroke:rgba(254, 189, 255, 1);stroke-dashoffset:25%;stroke-dasharray:0 50%;stroke-width:2;font-size:4em}70%{fill:rgba(252, 114, 255, 0);stroke:rgba(254, 189, 255, 1);font-size:4em}80%{fill:rgba(252, 114, 255, 0);stroke:rgba(254, 189, 255, 1);stroke-width:3;font-size:4em}100%{fill:rgba(252, 114, 255, 1);stroke:rgba(254, 189, 255,0);stroke-dashoffset:-25%;stroke-dasharray:50% 0;stroke-width:0;font-size:6em}}
  </style>
  <g clip-path="url(#clip0_3065_2800)">
    <path fill="url(#paint0_radial_3065_2800)" d="M0 0h1080v1080H0z"/>
    <path d="M352 400c0 13 12 23 26 23h112c0-6 2-13 4-19 3-5 6-10 11-14a56 56 0 0 1 72 0c5 4 9 9 11 14 3 6 4 13 4 19h110c14 0 26-10 26-23 0 0-35-142-187-142-160 0-189 142-189 142Z" fill="url(#paint1_linear_3065_2800)"/>
    <path d="M352 493c0-13 12-23 26-23h112c0-6 2-13 4-19 3-5 6-10 11-15 5-4 11-7 17-9a56 56 0 0 1 55 9c5 5 9 10 11 15 3 6 4 13 4 19h110c14 0 26 10 26 23 0 0-35 142-187 142-160 0-189-142-189-142Z" fill="url(#paint2_linear_3065_2800)"/>
    <path d="M84 84V52h15l9 2 6 6 2 8-2 8-6 6-9 2H84Zm8-6h6l6-1c1-1 3-2 3-4l2-5-2-5c0-2-2-3-3-4l-6-1h-6v20Zm29 6V60h7v6l-1-2c1-1 2-3 4-3l5-2v7h-1l-5 1-2 5v12h-7Zm31 0-7-1-5-5-1-6 1-7 5-4 7-2 7 2a12 12 0 0 1 7 11l-2 6-5 5-7 1Zm0-5 3-1 3-3v-7a6 6 0 0 0-6-3l-3 1-2 2-1 4 1 3a6 6 0 0 0 5 4Zm33 5-6-1-3-4-2-7 2-7c0-2 2-4 3-4l6-2a12 12 0 0 1 10 6l2 7-2 6-4 5-6 1Zm-15 9V60h7v33h-7Zm14-14a6 6 0 0 0 5-4l1-3-1-4a6 6 0 0 0-5-3l-4 1-2 2-1 4 1 3a6 6 0 0 0 6 4Zm18 5V60h7v24h-7Zm3-28-3-1-1-3 1-3 3-1 3 1 2 3-2 3-3 1Zm21 28-6-1a12 12 0 0 1-6-11l1-7 5-4a13 13 0 0 1 11 0c2 0 3 2 4 4l1 7-1 7-4 4-5 1Zm1-5 3-1 2-3 1-3-1-4a6 6 0 0 0-5-3l-3 1-2 2-1 4 1 3a6 6 0 0 0 5 4Zm7 5V72l-1-8V50h7v34h-6Z" fill="#fff"/>
    <path d="M83 122v-17h2l11 14h-1v-14h2v17h-2l-11-14h1v14h-2Zm21-9h9v2h-9v-2Zm0 9h-2v-17h12v2h-10v15Zm17 0v-15h-6v-2h14v2h-6v15h-2Zm17 0v-17h2v17h-2Zm7 0v-17h7l5 1 3 3 2 5-2 4-3 3-5 1h-7Zm3-2h4l4-1 2-2 1-3-1-4-2-2-4-1h-4v13Zm16-4v-2h7v2h-7Zm18 6h-3l-3-2a9 9 0 0 1 0-13l3-1 3-1 4 1 3 2-2 1-2-1-3-1-2 1a6 6 0 0 0-4 3v5a6 6 0 0 0 4 4 7 7 0 0 0 5 0l2-2 2 2-3 2h-4Zm7 0 8-17h2l8 17h-3l-7-15h1l-6 15h-3Zm3-4 1-2h9l1 2h-11Zm17 4v-17h7l4 1 2 2 1 3-1 3-2 2-4 1h-5l1-1v6h-3Zm11 0-4-6h3l4 6h-3Zm-8-6-1-1h5l3-1 1-3-1-3-3-1h-5l1-1v10Zm15 6v-17h7l4 1 4 3 1 5-1 4-4 3-4 1h-7Zm2-2h5l3-1 3-2v-7l-3-2-3-1h-5v13ZM943 78V62l1 1h-5v-2h6v17h-2Zm13 0a6 6 0 0 1-6-4l-1-4 1-5 2-3 4-1a6 6 0 0 1 6 4l1 5-1 4-3 3-3 1Zm0-2 2-1 2-2v-7l-2-2-2-1-3 1-1 2-1 4 1 3 1 2 3 1Zm16 2a6 6 0 0 1-6-4l-1-4 1-5 2-3 4-1a6 6 0 0 1 6 4l1 5-1 4-3 3-3 1Zm0-2 2-1 2-2v-7l-2-2-2-1-3 1-1 2-1 4 1 3 1 2 3 1Zm11 2 12-17h2l-12 17h-2Zm2-8a4 4 0 0 1-4-2v-5l2-1 2-1a4 4 0 0 1 3 2v5l-1 2h-2Zm0-1 1-1 1-2-1-3-1-1-2 1-1 3 1 2 2 1Zm10 9a4 4 0 0 1-3-2l-1-2 1-3 1-1 2-1a4 4 0 0 1 4 2v5l-2 2h-2Zm0-1 2-1 1-2-1-3-2-1-2 1v5l2 1Zm-143 30h-4l-3-2a9 9 0 0 1-2-6 9 9 0 0 1 2-7l3-1 4-1a9 9 0 0 1 6 2l2 3 1 4a9 9 0 0 1-3 6l-3 2h-3Zm0-2a7 7 0 0 0 4-2l2-2v-2a6 6 0 0 0-4-6l-2-1-3 1-2 1a6 6 0 0 0-2 5l1 2 1 2a6 6 0 0 0 5 2Zm16 2-6-17h2l6 16h-2l6-16h2l5 16h-1l5-16h2l-5 17h-3l-5-14h1l-5 14h-2Zm22 0V90h2l11 14h-1V90h3v17h-2l-11-14h1v14h-3Zm22-10h9v2h-9v-2Zm0 8h10v2h-12V90h12v2h-10v13Zm14 2V90h7l3 1 3 2 1 3-1 3-3 2-3 1h-6l1-1v6h-2Zm11 0-4-6h2l5 6h-3Zm-9-6-1-1h5l4-1 1-3-1-3-4-1h-5l1-1v10Zm20 6h-3l-3-2 1-2 2 2a9 9 0 0 0 6 0l1-1v-3l-2-1h-2l-2-1-2-1-1-1-1-2 1-3 2-1 4-1h3l2 1-1 2-2-1h-5l-1 1v3l2 1 2 1a36 36 0 0 1 4 1l1 1 1 2a4 4 0 0 1-3 5h-4Zm22-17h3v17h-3V90Zm-9 17h-3V90h3v17Zm10-7h-11v-3h11v3Zm7 7V90h2v17h-2Zm7 0V90h7l4 1 2 2 1 3-1 3-2 2-4 1h-5l1-1v6h-3Zm3-6-1-1h5l3-1 1-3-1-3-3-1h-5l1-1v10Z" fill="#fff" fill-opacity=".9"/>
    <g opacity=".8">
      <path d="M383 1038v-17h7l4 1c2 0 3 1 3 3l2 4-2 4c0 2-1 3-3 3l-4 2h-7Zm2-2h5l3-1a6 6 0 0 0 4-6l-1-3-3-3-3-1h-5v14Zm23 2-4-1a6 6 0 0 1-3-6l1-3a6 6 0 0 1 5-3 6 6 0 0 1 5 3 7 7 0 0 1 1 3v1h-11v-2h10v1l-1-2a4 4 0 0 0-4-3l-2 1-2 2v5l2 2h5l2-2v2l-2 1-2 1Zm12 0-6-13h2l5 12h-1l5-12h2l-6 13h-1Zm14 0-3-1a6 6 0 0 1-3-6l1-3a6 6 0 0 1 5-3 6 6 0 0 1 5 3 7 7 0 0 1 1 3v1h-11v-2h10v1l-1-2a4 4 0 0 0-4-3l-2 1-2 2v5l2 2h5l1-2 1 2-2 1-3 1Zm10 0v-18h1v18h-1Zm11 0-3-1a6 6 0 0 1-3-6l1-3 2-2 3-1 4 1 2 2 1 3-1 4-2 2-4 1Zm0-2h3l1-2 1-3-1-2-1-2-3-1-2 1-2 2v5l2 2h2Zm17 2-3-1-2-2-1-4 1-3 2-2 3-1a6 6 0 0 1 5 3l1 3-1 4-2 2-3 1Zm-7 4v-17h2v17h-2Zm7-6h2l2-2v-5a5 5 0 0 0-4-3l-3 1-2 2v5l2 2h3Zm15 2-4-1a6 6 0 0 1-3-6l1-3a6 6 0 0 1 5-3 6 6 0 0 1 6 3 7 7 0 0 1 0 3v1h-11v-2h10v1l-1-2a4 4 0 0 0-4-3l-2 1-2 2v5l2 2h5l2-2 1 2-2 1-3 1Zm14 0-3-1-3-2v-7l3-2 3-1 3 1 2 2 1 3-1 4-2 2-3 1Zm0-2h2l2-2 1-3-1-2-2-2-2-1a5 5 0 0 0-4 3l-1 2 1 3 2 2h2Zm5 2v-18h1v18h-1Zm19 0-3-1-2-2-1-4 1-3a5 5 0 0 1 5-3 6 6 0 0 1 5 3l1 3-1 4-2 2-3 1Zm-7 0v-18h2v18h-2Zm7-2h2l2-2 1-3-1-2-2-2-2-1-3 1-1 2-1 2 1 3 1 2h3Zm9 6h-1l-2-1 1-1 1 1h1l2-1 1-1 1-2 5-12h2l-6 14-2 2-1 1h-2Zm4-4-6-13h2l5 11-1 2ZM556 1038l7-17h4l8 17h-4l-6-15h1l-6 15h-4Zm4-4 1-3h8l1 3h-10Zm16 4v-13h4v3l-1-1 2-2 3-1v4h-1l-2 1-1 2v7h-4Zm18 0v-3l-1-1v-6l-3-1a6 6 0 0 0-3 2l-2-3 3-1 3-1 4 2c2 1 2 2 2 4v8h-3Zm-4 0-3-1-2-1v-4l2-2h7v2h-3l-2 1-1 1 1 1h3l1-2 1 2-2 2-2 1Zm16 0-4-1-1-4v-11h4v12l1 1 2-1 1 3-2 1h-1Zm-7-10v-3h9v3h-9Zm17 10-4-1-1-4v-11h4v12l1 1 2-1 1 3-1 1h-2Zm-7-10v-3h9v3h-9Zm20 10v-8l-1-2-2-1a6 6 0 0 0-4 2l-1-3 2-1 3-1 5 2 1 4v8h-3Zm-4 0-3-1-1-1-1-2 1-2 2-2h6v2h-3l-2 1v2h4l1-2v2l-1 2-3 1Zm18 0v-17h4v13h8v4h-12Zm22 0v-8l-1-2-2-1a6 6 0 0 0-4 2l-1-3 2-1 3-1 5 2 2 4v8h-4Zm-4 0-2-1-2-1-1-2 1-2 2-2h6v2h-3l-1 1-1 1 1 1h3l1-2v2l-1 2-3 1Zm19 0-3-1-2-2-1-4 1-4 2-2 3-1 3 1 2 3 1 3-1 4a6 6 0 0 1-5 3Zm-8 0v-18h4v18h-4Zm7-3a3 3 0 0 0 3-2v-4a3 3 0 0 0-3-2l-2 1-1 1v4a3 3 0 0 0 3 2Zm14 3-3-1-3-1 2-2a9 9 0 0 0 4 1h2v-2h-1a54 54 0 0 0-3-1l-2-1-1-1v-4l2-1 4-1 2 1 3 1-2 2-2-1h-1l-2 1h-1l1 1 1 1h3l1 1 2 1v2l-1 2-2 1-3 1Z" fill="#fff" fill-opacity=".9"/>
    </g>
  </g>
  <defs>
    <linearGradient id="paint1_linear_3065_2800" x1="728" y1="446.5" x2="409.6" y2="582.1" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FEBDFF"/>
      <stop offset="1" stop-color="#FC72FF"/>
    </linearGradient>
    <linearGradient id="paint2_linear_3065_2800" x1="728" y1="446.5" x2="409.6" y2="582.1" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FEBDFF"/>
      <stop offset="1" stop-color="#FC72FF"/>
    </linearGradient>
    <radialGradient id="paint0_radial_3065_2800" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 0 540) scale(540)">
      <stop stop-color="#B30FB7"/>
      <stop offset="1" stop-color="#04070C"/>
    </radialGradient>
    <clipPath id="clip0_3065_2800">
      <path fill="#fff" d="M0 0h1080v1080H0z"/>
    </clipPath>
  </defs>
  <text x="50%" y="80%" dominant-baseline="middle" text-anchor="middle" style="fill:#333;animation:stroke 5s infinite alternate;stroke-width:1;stroke:#fff;font-size:140px;text-shadow:3px 0 13px rgba(255,255,255,.4);font-family:'PP Mori'">${domain}</text>
</svg>`
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
  }

  const handleRegister = async (e) => {
    if (!auth.wallet) {
      toast.error(`Please connect your wallet and try again!`)
      return
    }

    const t = toast.loading(`Waiting for transaction's confirmation`)
    const price = _.toNumber(recordType.filter((item, i) => item.id.toString() === selectedRecordType.toString())[0].price)
    const recordTypeName = recordType.filter((item, i) => item.id.toString() === recordTypeRef.current.value.toString())[0].name

    try {
      generateImageUrl(`${txtSearchRef.current.value}.${recordTypeName}`).then((imageUrl) => {
        console.log(imageUrl)
        rAsset(imageUrl).then((result) => {
          console.log(result)
          console.log(`Verifiable URL`, _.keccak256(result))

          //metadata
          const rawMetadata = {
            LSP4Metadata: {
              name: import.meta.env.VITE_NAME,
              description: 'Link Your Wallet, Simplify Your address',
              links: [
                { title: 'Website', url: 'https://dropid.name' },
                { title: 'Mint', url: 'https://dropid.name' },
                { title: '𝕏', url: 'https://x.com/ArattaLabsDev' },
                { title: 'Telegram', url: 'https://t.me/arattalabs' },
              ],
              attributes: [
                { key: 'Username', value: txtSearchRef.current.value },
                { key: 'Extension', value: recordTypeName },
              ],
              icon: [{ width: 512, height: 512, url: 'ipfs://QmT6Uq86pPiPCdeCDWwPx7ELcU5EiWj47UrJwfw6vUicch', verification: { method: 'keccak256(bytes)', data: '0x24988e896aab7746f7fcabc3c20826db685711391f888ad4be21b5516372c365' } }],
              backgroundImage: [],
              assets: [],
              images: [[{ width: 500, height: 500, url: imageUrl, verification: { method: 'keccak256(bytes)', data: _.keccak256(result) } }]],
            },
          }
          //register
          contract.methods
            .register(txtSearchRef.current.value, selectedRecordType, _.toHex(rawMetadata)) //txtSearchRef.target.value_.padLeft(`0x1`, 63)
            .send({
              from: auth.wallet,
              value: price,
            })
            .then((res) => {
              console.log(res) //res.events.tokenId

              // Run partyjs
              party.confetti(document.querySelector(`input`), {
                count: party.variation.range(20, 40),
                shapes: ['coin'],
              })

              toast.success(`Transaction has been confirmed! Check out your NFTs`)

              toast.dismiss(t)
            })
            .catch((error) => {
              console.log(error)
              toast.dismiss(t)
            })

          //===========
        })
      })
    } catch (error) {
      console.log(error)
      toast.dismiss(t)
    }
  }

  useEffect(() => {
    getRecordType().then((res) => {
      console.log(res)
      setRecordType(res)
      setSelectedRecordType(res[0].id)
      setIsLoading(false)
    })

    getTotalRecordType().then((res) => {
      setTotalRecordType(_.toNumber(res))
      setIsLoading(false)
    })

    getTotalResolve().then((res) => {
      setTotalResolve(_.toNumber(res))
      setIsLoading(false)
    })

    getResolveList(auth.wallet).then((res) => {
      console.log(res)
      setIsLoading(false)
    })
  }, [])

  return (
    <>
      <section className={`${styles.section} ms-motion-slideDownIn`}>
        <div className={`${styles['wrapper']} w-100`}>
          <div className={`__container`} data-width={`medium`}>
            <h1 className={`${styles['example']}`}>
              {`fabian`}
              <span>.up</span>
            </h1>

            <div className={`${styles['form']}`}>
              <div className={`${styles['form__container']} d-flex flex-row`}>
                <input type={`text`} placeholder={`Search names or addresses`} onKeyUp={(e) => (e.code === `Enter` ? handleSearch() : '')} list={`apps`} min={2} accessKey={`s`} className={``} id={`username`} ref={txtSearchRef} />
                <select ref={recordTypeRef} defaultValue={selectedRecordType} onChange={(e) => setSelectedRecordType(e.target.value)}>
                  {recordType &&
                    recordType.length > 0 &&
                    recordType
                      .filter((item) => item.name !== '')
                      .map((item, i) => (
                        <option key={i} value={item.id}>
                          .{item.name}
                        </option>
                      ))}
                </select>
                <button onClick={() => handleSearch()}>Search</button>
              </div>
            </div>
          </div>
        </div>

        {freeToRegister === true && (
          <>
            <div className={`text-center`}>
              <p className={`text-center`}>Congratulations!🎉 The domain name is available for registration.</p>
              <button className=" pt-10 pb-10" onClick={() => handleRegister()}>
                Register
              </button>
            </div>
          </>
        )}

        {freeToRegister === false && (
          <>
            <div className={`text-center`}>
              <p className={`text-center text-danger`}>⛔ The name you are trying to register is already registered.</p>
            </div>
          </>
        )}

        <div className={`__container`} data-width={`medium`}>
          <div className={` ${styles['feature']}`}>
              <ul>
                <li className={`d-flex align-items-center`}>
                  <Icon name={`paid`} />
                  <div className={`d-flex flex-column`}>
                  <span>Tradeable</span>
                  <small>Your username is a valuable digital asset that can be bought, sold, or traded on the marketplace.</small>
                  </div>
                </li>
                <li className={`d-flex align-items-center`}>
                  <Icon name={`contract_edit`} />
                  <div className={`d-flex flex-column`}>
                  <span>100% Ownership</span>
                  <small>You have full control over your username, without any intermediaries.</small>
                  </div>
                </li>
                <li className={`d-flex align-items-center`}>
                  <Icon name={`verified`} />
                  <div className={`d-flex flex-column`}>
                  <span> Unique and Verifiable</span>
                  <small>Your Dropid username is a unique identifier on the blockchain, ensuring authenticity.</small>
                  </div>
                </li>
                <li className={`d-flex align-items-center`}>
                  <Icon name={`code_blocks`} />
                  <div className={`d-flex flex-column`}>
                  <span> Interoperable</span>
                  <small> Use your Dropid username across multiple platforms and applications.</small>
                  </div>
                </li>
                <li className={`d-flex align-items-center`}>
                  <Icon name={`verified_user`} />
                  <div className={`d-flex flex-column`}>
                  <span>Secure</span>
                  <small>Your username is protected by the security of the blockchain.</small>
                  </div>
                </li>
              </ul>
          </div>

          <pre className={`mt-40 ms-depth-4`}>
          <p style={{opacity: .5}}>// Fetch data effortlessly with Dropid SDK 🤯</p>
          const lyxAddress = LUKSO.getAddressRecord({JSON.stringify({ nodehash: 'fabian.up'} )})
          </pre>
        </div>
      </section>
    </>
  )
}

export default Home
