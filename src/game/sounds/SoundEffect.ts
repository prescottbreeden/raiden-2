export const SoundEffect = () => {
  let audio = new Audio()

  const play = (track: string) => {
    const nextTrack = new Audio()
    nextTrack.src = track
    audio = nextTrack
    audio.play()
  }

  const changeVolume = (num: number) => {
    audio.volume = num / 10
  }

  return {
    changeVolume,
    play,
  }
}
