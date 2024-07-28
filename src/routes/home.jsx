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

    // const recordTypeName = recordType.filter((item, i) => item.id.toString() === recordTypeRef.current.value.toString())[0].name
    // const nodehash = _.keccak256(_.toHex(`${txtSearchRef.current.value}.${recordTypeName}`))

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
  <g clip-path="url(#a)">
    <path fill="#04070C" d="M0 0h1080v1080H0z"/>
    <g filter="url(#b)">
      <path d="M352 400c0 13 12 23 26 23h112c0-6 2-13 4-19 3-5 6-10 11-14a56 56 0 0 1 72 0c5 4 9 9 11 14 3 6 4 13 4 19h110c14 0 26-10 26-23 0 0-35-142-187-142-160 0-189 142-189 142Z" fill="url(#c)"/>
      <path d="M352 493c0-13 12-23 26-23h112c0-6 2-13 4-19 3-5 6-10 11-15 5-4 11-7 17-9a56 56 0 0 1 55 9c5 5 9 10 11 15 3 6 4 13 4 19h110c14 0 26 10 26 23 0 0-35 142-187 142-160 0-189-142-189-142Z" fill="url(#d)"/>
    </g>
    <path d="M84 84V52h15l9 2 6 6 2 8-2 8-6 6-9 2H84Zm8-6h6l6-1c1-1 3-2 3-4l2-5-2-5c0-2-2-3-3-4l-6-1h-6v20Zm29 6V60h7v6l-1-2c1-1 2-3 4-3l5-2v7h-1l-5 1-2 5v12h-7Zm31 0-7-1-5-5-1-6 1-7 5-4 7-2 7 2a12 12 0 0 1 7 11l-2 6-5 5-7 1Zm0-5 3-1 3-3v-7a6 6 0 0 0-6-3l-3 1-2 2-1 4 1 3a6 6 0 0 0 5 4Zm33 5-6-1-3-4-2-7 2-7c0-2 2-4 3-4l6-2a12 12 0 0 1 10 6l2 7-2 6-4 5-6 1Zm-15 9V60h7v33h-7Zm14-14a6 6 0 0 0 5-4l1-3-1-4a6 6 0 0 0-5-3l-4 1-2 2-1 4 1 3a6 6 0 0 0 6 4Zm18 5V60h7v24h-7Zm3-28-3-1-1-3 1-3 3-1 3 1 2 3-2 3-3 1Zm21 28-6-1a12 12 0 0 1-6-11l1-7 5-4a13 13 0 0 1 11 0c2 0 3 2 4 4l1 7-1 7-4 4-5 1Zm1-5 3-1 2-3 1-3-1-4a6 6 0 0 0-5-3l-3 1-2 2-1 4 1 3a6 6 0 0 0 5 4Zm7 5V72l-1-8V50h7v34h-6Z" fill="#fff"/>
    <path d="M82 122v-17h3l10 12h-1v-12h4v17h-4l-10-12h2v12h-4Zm23-9h8v3h-8v-3Zm0 9h-3v-17h12v3h-9v14Zm15 0v-14h-5v-3h15v3h-6v14h-4Zm19 0v-17h3v17h-3Zm7 0v-17h8l5 1 3 3 1 5-1 4-3 3-5 1h-8Zm4-3h4l3-1 2-2v-5l-2-2-3-1h-4v11Zm16-2v-3h6v3h-6Zm18 5h-4a9 9 0 0 1-5-5v-7a9 9 0 0 1 5-4l4-1 4 1 3 2-3 2-2-1-2-1-2 1a5 5 0 0 0-3 2v5l1 1 2 2a6 6 0 0 0 4-1l2-1 3 2-3 3h-4Zm7 0 7-17h4l8 17h-4l-7-15h2l-6 15h-4Zm4-4 1-3h8l1 3h-10Zm16 4v-17h8l4 1 2 2 1 3-1 4-2 2h-9l1-1v6h-4Zm11 0-4-6h4l4 6h-4Zm-7-6-1-2h4l3-1 1-2-1-2-3-1h-4l1-1v9Zm14 6v-17h8l4 1 4 3 1 5-1 4-4 3-4 1h-8Zm4-3h3l3-1 2-2 1-2-1-3-2-2-3-1h-3v11ZM941 78V63l1 1h-5v-3h7v17h-3Zm14 0-4-1-3-3-1-4 1-5 3-3 4-1a7 7 0 0 1 6 4l1 5-1 4-3 3-3 1Zm0-3 1-1 1-1 1-3-1-3-1-2-1-1-2 1-1 2-1 3 1 3 1 1 2 1Zm16 3-4-1c-1 0-2-1-2-3l-1-4 1-5 2-3 4-1a7 7 0 0 1 6 4l1 5-1 4c-1 2-1 3-3 3l-3 1Zm0-3 2-1 1-1v-6l-1-2-2-1-2 1-1 2v6l1 1 2 1Zm11 3 12-17h3l-12 17h-3Zm2-8h-2l-2-2v-5l2-1 2-1 2 1 1 1 1 3-1 2-1 2h-2Zm0-2h1l1-2-1-2-1-1-1 1-1 2 1 2h1Zm11 10h-2l-1-2-1-2 1-3a4 4 0 0 1 3-2l2 1 2 1v5l-2 2h-2Zm0-2h1l1-2-1-2-1-1-1 1-1 2 1 2h1Zm-145 31h-4l-3-2a9 9 0 0 1-2-10 8 8 0 0 1 5-4l4-1 3 1a9 9 0 0 1 0 16h-3Zm0-3h2a5 5 0 0 0 2-3l1-2a6 6 0 0 0-2-4l-1-1-2-1-2 1a5 5 0 0 0-3 2l-1 3 1 2 1 1 2 2h2Zm15 3-5-17h4l5 15h-3l5-15h4l5 15h-2l5-15h4l-6 17h-4l-4-13h1l-5 13h-4Zm24 0V90h3l10 12h-2V90h4v17h-3l-10-12h2v12h-4Zm23-10h8v3h-8v-3Zm0 7h9v3h-13V90h13v3h-9v11Zm12 3V90h7l4 1 3 2 1 3-1 4-3 2h-9l2-1v6h-4Zm11 0-4-6h4l4 6h-4Zm-7-6-2-2h5l3-1 1-2-1-2-3-1h-5l2-1v9Zm19 6h-3l-3-2 1-3a10 10 0 0 0 5 2h2l1-1 1-1-1-1h-1l-2-1h-2l-2-1-2-2v-2l1-2 2-2 4-1h3l3 1-1 3a10 10 0 0 0-5-1h-2l-1 1v2l2 1a46 46 0 0 0 4 1l2 1 1 1v5l-3 2h-4Zm22-17h4v17h-4V90Zm-8 17h-4V90h4v17Zm8-7h-8v-3h8v3Zm8 7V90h3v17h-3Zm7 0V90h8l4 1 2 2 1 3-1 4-2 2h-9l1-1v6h-4Zm4-6-1-2h4l3-1 1-2-1-2-3-1h-4l1-1v9Z" fill="#fff" fill-opacity=".9"/>
    <g opacity=".9" fill="#fff" fill-opacity=".9">
      <path d="M326 1041v-23h10l6 2 5 4 1 6-1 6-5 4-6 1h-10Zm4-3h6l5-1 3-3 1-4-1-5-3-3-5-1h-6v17Zm30 3-4-1-4-3-1-5 1-4 3-3 5-1 4 1 3 3a9 9 0 0 1 1 5h-14v-2h13l-2 1v-3l-2-2-3-1-3 1-2 2-1 3v1l1 3 2 2h6l2-2 2 2-3 2-4 1Zm17 0-8-17h4l6 15h-1l6-15h3l-7 17h-3Zm21 0-5-1-4-3-1-5 1-4 4-3 4-1 4 1c2 0 3 2 3 3a9 9 0 0 1 1 5h-14v-2h13l-1 1-1-3-2-2-3-1-3 1-2 2-1 3v1l1 3 2 2h6l3-2 1 2c0 1-1 2-3 2l-3 1Zm12 0v-24h3v24h-3Zm16 0-4-1a9 9 0 0 1-5-8l1-4 4-3 4-1 5 1 3 3 1 4-1 5-3 3-5 1Zm0-3h3l2-2 1-4-1-3-2-2-3-1-3 1-2 2-1 3 1 4a6 6 0 0 0 5 2Zm23 3-4-1c-2 0-2-1-3-3l-1-5 1-4c0-2 1-3 3-3l4-1 4 1 3 3 1 4-1 5-3 3-4 1Zm-10 6v-23h3v8l1 4v11h-4Zm9-9h3l2-2 1-4-1-3-2-2-3-1-3 1-2 2v7a6 6 0 0 0 5 2Zm21 3-5-1-3-3-1-5 1-4 3-3 5-1 4 1 3 3a9 9 0 0 1 1 5h-15v-2h13l-1 1-1-3-2-2-2-1-3 1-2 2-1 3v1l1 3 2 2h6l2-2 2 2-3 2-4 1Zm19 0-4-1-3-3-1-5 1-4 3-3a9 9 0 0 1 8 0c2 0 3 1 3 3l1 4-1 5c0 2-1 3-3 3l-4 1Zm1-3h3l2-2 1-4-1-3-2-2-3-1-3 1-2 2-1 3 1 4a6 6 0 0 0 5 2Zm6 3v-9l-1-4v-11h4v24h-3Zm26 0-4-1c-1 0-2-1-2-3l-1-5 1-4c0-2 1-3 2-3l4-1 5 1 3 3 1 4-1 5-3 3-5 1Zm-9 0v-24h3v24h-3Zm9-3h3l2-2 1-4-1-3-2-2-3-1-3 1-2 2-1 3 1 4a6 6 0 0 0 5 2Zm14 9a7 7 0 0 1-5-1l2-2a5 5 0 0 0 3 1l1-1 2-2 1-2v-1l7-15h3l-8 19-2 3-2 1h-2Zm4-5-8-18h3l7 15-2 3ZM563 1041l10-23h5l10 23h-5l-9-20h3l-9 20h-5Zm5-5 1-4h12l1 4h-14Zm22 5v-17h5v4l-1-1 3-3 4-1v5h-1l-3 1-2 4v8h-5Zm24 0v-3l-1-1v-6l-1-3-3-1a8 8 0 0 0-5 2l-1-4 3-1 4-1 6 2c2 1 2 3 2 6v10h-4Zm-6 0h-3l-2-2-1-3 1-3 2-2h9v3h-7v2l1 1 2 1 2-1 1-2 1 3-2 2-4 1Zm22 0-5-1-1-5v-15h5v17h4l1 3-2 1h-2Zm-9-13v-4h12v4h-12Zm23 13-5-1-2-5v-15h5v15l1 2h4l1 3-2 1h-2Zm-9-13v-4h12v4h-12Zm27 13v-3l-1-1v-6l-1-3-3-1a8 8 0 0 0-5 2l-2-4 4-1 4-1 6 2c2 1 2 3 2 6v10h-4Zm-6 0h-3l-3-2v-6l3-2h9v3h-7v3l2 1 3-1 1-2 1 3-2 2-4 1Zm24 0v-23h6v19h11v4h-17Zm30 0v-10l-1-3-3-1a8 8 0 0 0-5 2l-2-4 4-1 4-1 6 2 2 6v10h-5Zm-5 0h-3l-3-2v-6l3-2h9v3h-7v3l2 1 3-1 1-2 1 3-2 2-4 1Zm25 0-4-1c-1 0-2-1-2-3l-1-5 1-5a7 7 0 0 1 6-4l4 1 4 4 1 4-1 5a8 8 0 0 1-8 4Zm-10 0v-24h5v10l-1 5 1 5v4h-5Zm9-4a4 4 0 0 0 4-2l1-3-1-2a4 4 0 0 0-4-3l-2 1-2 2v5a4 4 0 0 0 4 2Zm19 4h-4l-4-2 2-3a12 12 0 0 0 6 1h3v-2l-2-1a72 72 0 0 0-4 0l-2-1-2-2v-2l1-3 3-2 4-1 4 1 3 1-2 3-3-1h-2l-3 1v2h2a37 37 0 0 0 4 1l2 1 2 1v3l-1 3-3 2h-4Z"/>
    </g>
  </g>
  <defs>
    <linearGradient id="c" x1="728" y1="446.5" x2="409.6" y2="582.1" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FEBDFF"/>
      <stop offset="1" stop-color="#FC72FF"/>
    </linearGradient>
    <linearGradient id="d" x1="728" y1="446.5" x2="409.6" y2="582.1" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FEBDFF"/>
      <stop offset="1" stop-color="#FC72FF"/>
    </linearGradient>
    <clipPath id="a">
      <path fill="#fff" d="M0 0h1080v1080H0z"/>
    </clipPath>
    <filter id="b" x="279" y="188" width="522.6" height="523.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="4"/>
      <feGaussianBlur stdDeviation="36.6"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix values="0 0 0 0 0.988235 0 0 0 0 0.447059 0 0 0 0 1 0 0 0 1 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_3065_2800"/>
      <feBlend in="SourceGraphic" in2="effect1_dropShadow_3065_2800" result="shape"/>
    </filter>
  </defs>
</svg>`
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
  }

  const handleRegister = async (e) => {
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
 const rawMetadata ={
  LSP4Metadata: {
    name: '2222222222222',
    description:'Mint ydssdsd',
    links: [
      { title: 'Website', url: 'https://pepitolyx.com' },
      { title: 'Mint', url: 'https://genesis.pepitolyx.com' },
      { title: 'Common Ground', url: 'https://app.cg/c/Pepito' },
      { title: '𝕏', url: 'https://x.com/pepitolyx' },
      { title: 'Telegram', url: 'https://t.me/pepitolyx' },
    ],
    attributes: [
      { key: 'Stage', value: '0' },
      { key: 'Type', value: 'Spawn' },
      { key: 'Background', value: '' },
      { key: 'Skin', value: '' },
      { key: 'Eyes', value: '' },
      { key: 'Tattoos', value: '' },
      { key: 'Clothes', value: '' },
      { key: 'Headgear', value: '' },
      { key: 'Accessory', value: '' },
    ],
    icon: [{ width: 512, height: 512, url: 'ipfs://QmdrcEfQnWZhisc2bF4544xdJGHBQhWLaoGBXZSvrvSTxT', verification: { method: 'keccak256(bytes)', data: '0xeb14faa594192b57a2c4edb6ae212c1a6b3848409176e7c900141132d9902c85' } }],
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
  // party.confetti(document.querySelector(`#egg`), {
  //   count: party.variation.range(20, 40),
  //   shapes: ['egg', 'coin'],
  // })

  toast.dismiss(t)
}).catch((error) => {
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
      <section className={`${styles.section} ms-motion-slideDownIn d-f-c flex-column`}>
        <div className={`${styles['__container']} __container`} data-width={`medium`}>
          <h1 className={`${styles['example']} d-f-c`}>
            alex <span>.lyx</span>{' '}
          </h1>

          <div className={`${styles['form']}`}>
            <div className={`${styles['form__container']} d-flex flex-row`}>
              <input type={`text`} placeholder={`Search names or addresses`} list={`apps`} min={2} accessKey={`s`} className={``} id={`username`} ref={txtSearchRef} />
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
   
          {freeToRegister === true && (
            <>
              
              <div className={`text-center`}>
                <p className={`text-center`}>Congratulations!🎉 The domain name is available for registration.</p>
                <button className="btn pt-10 pb-10" onClick={() => handleRegister()}>
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
        </div>
      </section>
    </>
  )
}

export default Home
