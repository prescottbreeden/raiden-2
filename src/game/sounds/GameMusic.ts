import jam from '../../assets/music/soundtrack.mp3';
import tragedy from '../../assets/music/Tragedy-Flame-Stages-2.mp3';
import allOrNothing from '../../assets/music/All-Or-Nothing-Stage-3.mp3';
import burntField from '../../assets/music/Burnt-Field-Stage-4.mp3';
import depression from '../../assets/music/Depression-Stage-5.mp3';
import decisiveBattle from '../../assets/music/Decisive-Battle-Stage-6.mp3';
import flapToward from '../../assets/music/Flap-Toward-The-Hope-Stage-7.mp3';
import allClear from '../../assets/music/All-Clear.mp3';
import bossFight from '../../assets/music/Boss.mp3';

const tracks: { [key: string]: string } = {
  stage1: jam,
  stage2: tragedy,
  stage3: allOrNothing,
  stage4: burntField,
  stage5: depression,
  stage6: decisiveBattle,
  stage7: flapToward,
  credits: allClear,
  boss: bossFight,
};
export const GameMusic = () => {
  let audio = new Audio();

  const playMusic = (track: string) => {
    const nextTrack = new Audio();
    nextTrack.src = tracks[track];
    audio = nextTrack;
    audio.play();
  };

  const changeVolume = (num: number) => {
    audio.volume = num / 10;
  };

  return {
    changeVolume,
    playMusic,
  };
};
