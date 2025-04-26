import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import './App.css'

function Fireworks({ trigger }) {
  useEffect(() => {
    if (trigger) {
      const duration = 2 * 1000
      const animationEnd = Date.now() + duration
      const colors = ['#ff6ec7', '#fff', '#ffb86c', '#8be9fd', '#f1fa8c']
      function frame() {
        confetti({
          particleCount: 7,
          angle: 60 + Math.random() * 60,
          spread: 70,
          origin: { x: Math.random(), y: Math.random() * 0.6 },
          colors,
        })
        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [trigger])
  return null
}

function HeartButton({ onClick }) {
  return (
    <motion.button
      className="heart-btn"
      onClick={onClick}
      whileTap={{ scale: 0.9, rotate: [0, -10, 10, 0] }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 10 } }}
    >
      <span className="heart-shape"></span>
      <span className="pulse"></span>
    </motion.button>
  )
}

function MainLovePage() {
  const [blur, setBlur] = useState(20)
  const [volume, setVolume] = useState(0)
  const [funnyMessages, setFunnyMessages] = useState([])
  const [floatingGifs, setFloatingGifs] = useState([])
  const audioRef = useRef(null)

  // List of cute/funny messages
  const messageList = [
    "mimiiiii",
    "pero tú me quiereeeeeee??? :)",
    "te echo mucho de meno....tú dónde ta",
    "ven ya :(",
    "aaaaaaaaaaaaaaaaaaaaaaaa",
    "ofú -.- *se pone cachondo*",
    "nenanenanenanena mirame a miiiii"
  ]

  const gifList = [
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm1kMHJrc2JneGF0MzhlNnI3b29tazFhMWVxazR0M2Izbm1neXVpNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KztT2c4u8mYYUiMKdJ/giphy.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXhoenVhbzlkaDgxaTJpZnN3cTBlOHc5YXgyODZjbGZ0dHJzZmFvbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KmxmoHUGPDjfQXqGgv/giphy.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3N6azBidW93OHd1M3B2a2N4eXFkNWNsZjRkMjZ4amg3dXVwYWd3biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Gf54zTxt2QKru/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmU0NDEzc2l0a3J5ZHdyOXdnankxYjJseTUzbWJienN2MzNxYnY1dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/kvrvnB158J4fm/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2drOGtsbzl5aGd2bzY3M2MzemNjNTZ1Y2RlYWloeHd4NmFoZ2NuOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oriO6qJiXajN0TyDu/giphy.gif",
    "https://media.giphy.com/media/WP1Z0FfnuMuXqPvDlj/giphy.gif?cid=ecf05e4744wliztpggofsd0boecw5vjafpv7fy8jos4ttlbx&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW5kc2V3bWhmNjNmZzB3aTRndWhuMmJxa3d0ZGN1Y2x5aWh2Y3B3ZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/qFmdpUKAFZ6rMobzzu/giphy.gif"
  ]

  // Handle photo click to show random message
  const handlePhotoClick = () => {
    const msg = messageList[Math.floor(Math.random() * messageList.length)]
    const id = Date.now() + Math.random()
    setFunnyMessages((prev) => [...prev, { id, msg }])
    // Remove after 5.2s
    setTimeout(() => {
      setFunnyMessages((prev) => prev.filter((m) => m.id !== id))
    }, 5200)
  }

  // Spawn a floating gif every 3-5 seconds
  useEffect(() => {
    let running = true
    function spawnGif() {
      if (!running) return
      const url = gifList[Math.floor(Math.random() * gifList.length)]
      const left = Math.random() * 70 + 10 // random between 10% and 80%
      const id = Date.now() + Math.random()
      setFloatingGifs(gifs => [...gifs, { id, url, left }])
      const nextDelay = Math.random() * 2000 + 3000 // 3-5 seconds
      setTimeout(spawnGif, nextDelay)
    }
    spawnGif()
    return () => { running = false }
  }, [])

  // Remove gifs after their animation duration
  useEffect(() => {
    if (!floatingGifs.length) return
    const timers = floatingGifs.map(gif =>
      setTimeout(() => {
        setFloatingGifs(gifs => gifs.filter(g => g.id !== gif.id))
      }, 15500)
    )
    return () => timers.forEach(clearTimeout)
  }, [floatingGifs])

  useEffect(() => {
    let blurStart = 20
    let blurEnd = 0
    let blurDuration = 15000
    let volumeStart = 0
    let volumeEnd = 1
    let volumeDuration = 7000
    let start = null
    let rafId

    function animate(ts) {
      if (!start) start = ts
      let elapsed = ts - start
      let blurVal = blurStart + (blurEnd - blurStart) * Math.min(elapsed / blurDuration, 1)
      setBlur(blurVal)
      let volVal = volumeStart + (volumeEnd - volumeStart) * Math.min(elapsed / volumeDuration, 1)
      setVolume(volVal)
      if (audioRef.current) audioRef.current.volume = Math.min(volVal, 1)
      if (elapsed < Math.max(blurDuration, volumeDuration)) {
        rafId = requestAnimationFrame(animate)
      } else {
        setBlur(blurEnd)
        setVolume(volumeEnd)
        if (audioRef.current) audioRef.current.volume = 1
      }
    }
    rafId = requestAnimationFrame(animate)
    if (audioRef.current) {
      audioRef.current.volume = 0
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
    return () => {
      cancelAnimationFrame(rafId)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  return (
    <motion.div
      className="main-love-page"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 2, type: 'spring', stiffness: 60, damping: 20 } }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 1 } }}
    >
      <div className="crazy-bg"></div>
      <motion.img
        src="/pic.jpg"
        alt="Love Pic"
        className="love-pic"
        style={{ filter: `blur(${blur}px)`, cursor: 'pointer' }}
        initial={{ scale: 1.3, opacity: 0.7, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0, transition: { duration: 2.6, type: 'spring', stiffness: 70, damping: 18 } }}
        whileHover={{ scale: 1.04, boxShadow: '0 0 160px 40px #ffb6c1' }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePhotoClick}
      />
      {/* Animated funny messages */}
      <AnimatePresence>
        {funnyMessages.map(({ id, msg }) => (
          <motion.div
            key={id}
            className="funny-message"
            initial={{ y: 0, opacity: 0, top: '30%' }}
            animate={{
              y: -180, // upward movement in px
              opacity: [0, 1, 1, 0],
              top: ["30%", "18%", "10%", "5%"],
              transition: {
                duration: 5.2,
                ease: 'easeInOut',
                opacity: { times: [0, 0.12, 0.7, 1], duration: 5.2 },
                top: { duration: 5.2 },
                y: { duration: 5.2 },
              }
            }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', left: '50%', top: '30%', transform: 'translate(-50%, 0)', zIndex: 10, pointerEvents: 'none' }}
          >
            {msg}
          </motion.div>
        ))}
      </AnimatePresence>
      {/* Floating GIFs, random position, float up and fade out */}
      <AnimatePresence>
        {floatingGifs.map(gif => (
          <motion.img
            key={gif.id}
            src={gif.url}
            alt="Floating gif"
            className="cat-love-gif"
            initial={{ y: 80, opacity: 0 }}
            animate={{
              y: -940,
              opacity: [0, 1, 1, 0],
              transition: {
                y: { duration: 15.5, ease: 'easeInOut' },
                opacity: { times: [0, 0.1, 0.7, 1], duration: 15.5 }
              }
            }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              left: `${gif.left}%`,
              bottom: '32px',
              width: '90px',
              height: 'auto',
              zIndex: 15,
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
      {/* Cute cat love GIF floating up and fading out */}
      <AnimatePresence>
        <motion.img
          key="cat-love-gif"
          src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm1kMHJrc2JneGF0MzhlNnI3b29tazFhMWVxazR0M2Izbm1neXVpNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KztT2c4u8mYYUiMKdJ/giphy.gif"
          alt="Cute cat love gif"
          className="cat-love-gif"
          initial={{ y: 80, opacity: 0 }}
          animate={{
            y: -940,
            opacity: [0, 1, 1, 0],
            transition: {
              y: { duration: 15.5, ease: 'easeInOut' },
              opacity: { times: [0, 0.1, 0.7, 1], duration: 15.5 }
            }
          }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '32px',
            width: '90px',
            height: 'auto',
            zIndex: 15,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        />
      </AnimatePresence>
      <audio ref={audioRef} src="/soundtrack.mp3" loop />
      <motion.div
        className="love-message"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 2, duration: 2, type: 'spring', stiffness: 60, damping: 14 } }}
      >
        Te quiero mucho de millone
      </motion.div>
      <motion.div
        className="love-message"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 2, duration: 2, type: 'spring', stiffness: 60, damping: 14 } }}
      >
        de millone de infinito 💖
      </motion.div>
    </motion.div>
  )
}

function App() {
  const [step, setStep] = useState(0)
  const [fireworks, setFireworks] = useState(false)

  const handleHeartClick = () => {
    setFireworks(true)
    setTimeout(() => {
      setStep(1)
      setFireworks(false)
    }, 1800)
  }

  return (
    <div className="app-root">
      <Fireworks trigger={fireworks} />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            className="home-page"
            key="home"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 1.5 } }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          >
            <motion.h1
              className="love-title"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
            >
              He hecho esto para ti
            </motion.h1>
            <motion.h1
              className="love-title"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
            >
              (pulsa el corazoncito...)
            </motion.h1>
            <HeartButton onClick={handleHeartClick} />
            <div className="crazy-bg"></div>
          </motion.div>
        )}
        {step === 1 && <MainLovePage key="main" />}
      </AnimatePresence>
    </div>
  )
}

export default App
