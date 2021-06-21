<template>
  <div class="playerContainer">
    <video
      id="videojs-player"
      class="video-js vjs-default-skin vjs-16-9 vjs-big-play-centered"
      controls
      autoplay
      playsinline
    />
  </div>
</template>

<script lang="ts">
import videojs from 'video.js'
import { registerIVSQualityPlugin, registerIVSTech } from 'amazon-ivs-player'

// @ts-ignore
import wasmBinaryPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.wasm'
import wasmWorkerPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js'

export default {
  name: 'IVS-Player',
  data () {
    return {
      player: null
    }
  },
  mounted () {
    // register the tech with videojs
    registerIVSTech(videojs, {
      wasmWorker: new URL(wasmWorkerPath, document.URL).toString(),
      wasmBinary: new URL(wasmBinaryPath, document.URL).toString()
    })

    // register the quality plugin
    registerIVSQualityPlugin(videojs)

    // create the player with the appropriate types. We're using @types/video.js VideoJsPlayer, and intersecting our Player and Quality Plugin interface
    this.player = videojs(
      'videojs-player',
      {
        techOrder: ['AmazonIVS'],
        autoplay: true
      },
      function () {
        console.warn('Player is ready to use')
      }
    )

    // enable the quality plugin
    this.player.enableIVSQualityPlugin()

    // listen to IVS specific events
    const events = this.player.getIVSEvents()
    const ivsPlayer = this.player.getIVSPlayer()
    ivsPlayer.addEventListener(events.PlayerState.PLAYING, () => {
      console.log('IVS Player is playing')
    })

    const liveStreamUrl =
      'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8'

    this.player.src(liveStreamUrl)
  },
  beforeDestroy () {
    /*
      Using delete method causes player malfunction, while using dispose method from videojs, it works,
      but accumulating amazon-ivs-wasmworker.min.js and leading to memory leak.

      if we dont delete player, get waring from videojs:
      VIDEOJS: WARN: Player "videojs-player" is already initialised. Options will not be applied.
      Player is ready to use
    */

    // const player = this.player.getIVSPlayer();
    // player.delete();

    this.player.dispose()
  }
}
</script>

<style scoped>
.playerContainer {
  width: 1060px;
  height: 480px;
  margin: auto;
}
</style>
