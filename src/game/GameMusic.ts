export const GameMusic = () => {
  let audio = new Audio()

  const changeMusic = (track: string) => {
    const nextTrack = new Audio()
    nextTrack.src = track
    audio = nextTrack
  }

  const changeVolume = (num: number) => {
    audio.volume = num / 10
  }

  const pause = () => {
    audio.pause()
  }

  const play = () => {
    audio.play()
  }

  return {
    changeMusic,
    changeVolume,
    pause,
    play,
  }
}
