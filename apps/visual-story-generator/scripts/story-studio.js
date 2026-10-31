/**
 * VISUAL STORY GENERATOR - MANO LAB
 * story-studio.js - Studio Controller, Recording Orchestrator & Video Exporter
 */

class StoryStudioApp {
  constructor() {
    this.canvas = document.getElementById('story-canvas');
    this.characterRig = new CharacterRig();
    this.audioStudio = new AudioStudio();
    this.director = new SceneDirector(this.canvas, this.characterRig, this.audioStudio);

    this.isPlaying = false;
    this.lastTime = performance.now();
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecordingVideo = false;

    this.init();
  }

  init() {
    // 1. Bind all UI controls
    this.bindEvents();

    // 2. Start initial render frame
    this.director.render(0.016);

    // 3. Start render loop
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  bindEvents() {
    // Archetype Switcher Buttons
    document.querySelectorAll('.btn-archetype').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-archetype').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.getAttribute('data-archetype');
        this.characterRig.setArchetype(type);
        this.showToast(`Character switched to: ${btn.textContent.trim()}`);
      });
    });

    // Camera Shot Switcher Buttons
    document.querySelectorAll('.btn-shot').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-shot').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const shot = btn.getAttribute('data-shot');
        this.director.setShotMode(shot);
      });
    });

    // Environment Preset Select
    document.getElementById('select-env').addEventListener('change', (e) => {
      this.director.setEnvironment(e.target.value);
    });

    // Voice FX Preset Select
    document.getElementById('select-voice-fx').addEventListener('change', (e) => {
      this.audioStudio.setPresetVoiceFX(e.target.value);
      this.showToast(`Studio Voice FX: ${e.target.value}`);
    });

    // Play / Pause Button
    const playBtn = document.getElementById('btn-play-pause');
    playBtn.addEventListener('click', () => {
      if (this.isPlaying) {
        this.pause();
        playBtn.textContent = '▶ Play Narration';
      } else {
        this.play();
        playBtn.textContent = '⏸ Pause';
      }
    });

    // Microphone Recording Button
    const micBtn = document.getElementById('btn-record-mic');
    micBtn.addEventListener('click', async () => {
      if (this.audioStudio.isRecordingMic) {
        this.audioStudio.stopMicRecording();
        micBtn.classList.remove('active');
        micBtn.innerHTML = '<span>🎙️</span> <span>Record My Voice</span>';
        this.showToast('Voice recording saved! Press Play to watch your character speak.');
      } else {
        const ok = await this.audioStudio.startMicRecording();
        if (ok) {
          micBtn.classList.add('active');
          micBtn.innerHTML = '<span>⏹</span> <span>Stop Recording</span>';
          this.showToast('Recording voice... speak naturally into your microphone!');
        } else {
          this.showToast('Microphone not accessible. Please check browser permissions.');
        }
      }
    });

    // Custom Audio File Upload
    document.getElementById('input-upload-audio').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        await this.audioStudio.loadCustomAudioFile(file);
        this.showToast(`Loaded audio file: ${file.name}`);
        this.play();
        playBtn.textContent = '⏸ Pause';
      }
    });

    // Video Recording & Export Button
    const recBtn = document.getElementById('btn-record-video');
    const recBadge = document.getElementById('recording-badge');

    recBtn.addEventListener('click', () => {
      if (this.isRecordingVideo) {
        this.stopVideoRecording();
        recBadge.classList.remove('active');
        recBtn.innerHTML = '<span>🔴</span> <span>Record & Export 9:16 Video</span>';
      } else {
        this.startVideoRecording();
        recBadge.classList.add('active');
        recBtn.innerHTML = '<span>⏹</span> <span>Stop & Save Video</span>';
      }
    });

    // Subtitle Text Input
    document.getElementById('input-subtitle-text').addEventListener('input', (e) => {
      const text = e.target.value;
      this.director.activeSubtitle = text;
      this.director.highlightWords = text.trim().split(/\s+/);
      this.director.activeWordIndex = 0;
    });
  }

  play() {
    this.isPlaying = true;
    this.audioStudio.playVoice(() => {
      this.isPlaying = false;
      document.getElementById('btn-play-pause').textContent = '▶ Play Narration';
      if (this.isRecordingVideo) {
        this.stopVideoRecording();
      }
    });
  }

  pause() {
    this.isPlaying = false;
    this.audioStudio.stopVoice();
  }

  /**
   * Video Recording Engine: Hooks Canvas 60 FPS + WebAudio Destination Stream
   */
  startVideoRecording() {
    this.isRecordingVideo = true;
    this.recordedChunks = [];

    const canvasStream = this.canvas.captureStream(60);
    const audioStream = this.audioStudio.destinationNode ? this.audioStudio.destinationNode.stream : null;

    let combined = canvasStream;
    if (audioStream && audioStream.getAudioTracks().length > 0) {
      combined = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);
    }

    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') 
      ? 'video/webm;codecs=vp9,opus' 
      : 'video/webm';

    this.mediaRecorder = new MediaRecorder(combined, {
      mimeType: mime,
      videoBitsPerSecond: 6000000 // 6 Mbps studio video bitrate
    });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: mime });
      this.isRecordingVideo = false;

      // Trigger automatic file download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CharacterStory_${this.characterRig.archetype}_${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);

      this.showToast('9:16 Video recorded and downloaded successfully!');
      document.getElementById('recording-badge').classList.remove('active');
      document.getElementById('btn-record-video').innerHTML = '<span>🔴</span> <span>Record & Export 9:16 Video</span>';
    };

    this.mediaRecorder.start(200);

    // Play narration and animation
    this.play();
    document.getElementById('btn-play-pause').textContent = '⏸ Pause';
  }

  stopVideoRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.pause();
  }

  renderLoop(timestamp) {
    const dt = Math.min(0.08, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    this.director.render(dt);

    requestAnimationFrame(this.renderLoop.bind(this));
  }

  showToast(msg) {
    const t = document.getElementById('toast-notice');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => {
      t.classList.remove('show');
    }, 3000);
  }
}

// Launch on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  new StoryStudioApp();
});
