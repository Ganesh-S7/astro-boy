import {Howl} from 'howler';
import audioCompleteLevel from '../audio/audioCompleteLevel.mp3'
import audioDescend from '../audio/audioDescend.mp3'
import audioDie from '../audio/audioDie.mp3'
import audioFireFlowerShot from '../audio/audioFireFlowerShot.mp3'
import audioFireworkBurst from '../audio/audioFireworkBurst.mp3'
import audioFireworkWhistle from '../audio/audioFireworkWhistle.mp3'
import audioGameOver from '../audio/audioGameOver.mp3'
import audioJump from '../audio/audioJump.mp3'
import audioLosePowerUp from '../audio/audioLosePowerUp.mp3'
import audioMusicLevel1 from '../audio/audioMusicLevel1.mp3'
import audioObtainPowerUp from '../audio/audioWinLevel.mp3'
import goombaSquash from '../audio/goombaSquash.mp3'

export const audio = {
  completeLevel: new Howl({
    src: [audioCompleteLevel],
    volume: 0.5
  }),
  descend: new Howl({
    src: [audioDescend],
    volume: 0.5
  }),
  die: new Howl({
    src: [audioDie],
    volume: 0.5
  }),
  fireFlowerShot: new Howl({
    src: [audioFireFlowerShot],
    volume: 0.5
  }),
  fireworkBurst: new Howl({
    src: [audioFireworkBurst],
    volume: 0.5
  }),

  fireworkWhistle: new Howl({
    src: [audioFireworkWhistle],
    volume: 0.5
  }),
  gameOver: new Howl({
    src: [audioGameOver],
    volume: 0.5
  }),
  jump: new Howl({
    src: [audioJump],
    volume: 0.5
  }),
  losePowerUp: new Howl({
    src: [audioLosePowerUp],
    volume: 0.5
  }),
  musicLevel1: new Howl({
    src: [audioMusicLevel1],
    volume: 0.2,
    loop: true,
    autoplay: true
  }),
  obtainPowerUp: new Howl({
    src: [audioObtainPowerUp],
    volume: 0.5
  }),
  goombaSquash: new Howl({
    src: [goombaSquash],
    volume: 0.5
  })
}
