/**
 * VISUAL STORY GENERATOR - MANO LAB
 * story-studio.js - Automated AI Director, Instant Character Animation & Video Exporter
 */

class StoryStudioApp {
  constructor() {
    this.canvas = document.getElementById('story-canvas');
    const CharRig = (typeof CharacterRig !== 'undefined' ? CharacterRig : window.CharacterRig);
    const AudStudio = (typeof AudioStudio !== 'undefined' ? AudioStudio : window.AudioStudio);
    const ScnDirector = (typeof SceneDirector !== 'undefined' ? SceneDirector : window.SceneDirector);

    this.char1 = new CharRig('SHESHANAGA');
    this.char2 = new CharRig('VASUKI');
    this.audioStudio = new AudStudio();
    this.director = new ScnDirector(this.canvas, this.char1, this.audioStudio, this.char2);

    this.isPlaying = false;
    this.isStorySequencePlaying = false;
    this.lastTime = performance.now();
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecordingVideo = false;

    // Curated Cinematic Stories
    this.storyPresets = {
      'SHESHANAGA_VASUKI': {
        title: 'Sheshanaga & Vasuki (Cosmic Ocean)',
        char1Archetype: 'SHESHANAGA',
        char2Archetype: 'VASUKI',
        castName: 'Sheshanaga & Vasuki',
        worldName: 'Himalayan Summit & Cosmic Void',
        avatar: '🐍',
        scenes: [
          {
            env: 'HIMALAYAN_SUMMIT',
            speaker: 0,
            speakerName: 'Sheshanaga',
            text: 'एक ही माँ के दो अमर पुत्र... शेषनाग और वासुकि!',
            char1TargetX: -90,
            char2TargetX: 90,
            shot: 'WIDE_ESTABLISHING',
            duration: 5.5
          },
          {
            env: 'COSMIC_VOID',
            speaker: 1,
            speakerName: 'Vasuki',
            text: 'क्षीर सागर के मंथन में मैंने मंदराचल को थामा, और तुमने अनंत शय्या बनाई।',
            char1TargetX: -70,
            char2TargetX: 70,
            shot: 'MEDIUM_ACTION',
            duration: 6.5
          },
          {
            env: 'GOLDEN_TEMPLE',
            speaker: 0,
            speakerName: 'Sheshanaga',
            text: 'जब तक धर्म रहेगा, नागवंश का यह त्याग सृष्टि याद रखेगी!',
            char1TargetX: -40,
            char2TargetX: 40,
            shot: 'HERO_CLOSEUP',
            duration: 5.5
          }
        ]
      },
      'RUDRA_RISHI': {
        title: 'Rudra & Sage (Secret of Time)',
        char1Archetype: 'RUDRA',
        char2Archetype: 'RISHI',
        castName: 'Rudra & Rishi',
        worldName: 'Sacred Ashrama & Kailash',
        avatar: '👑',
        scenes: [
          {
            env: 'SACRED_ASHRAMA',
            speaker: 1,
            speakerName: 'Rishi',
            text: 'हे महादेव! सृष्टि और महाप्रलय के मध्य काल का क्या रहस्य है?',
            char1TargetX: -100,
            char2TargetX: 90,
            shot: 'DUTCH_LOW_ANGLE',
            duration: 5.5
          },
          {
            env: 'ROYAL_DARBAR',
            speaker: 0,
            speakerName: 'Rudra',
            text: 'काल वह चक्र है मुनिवर, जो न प्रारंभ जानता है न अंत। सब मुझमें विलीन है।',
            char1TargetX: -60,
            char2TargetX: 100,
            shot: 'HERO_CLOSEUP',
            duration: 6.5
          },
          {
            env: 'HIMALAYAN_SUMMIT',
            speaker: 0,
            speakerName: 'Rudra',
            text: 'जब तांडव शांत होगा, तब केवल शून्य और विशुद्ध चेतना शेष रहेगी।',
            char1TargetX: 0,
            char2TargetX: 110,
            shot: 'WIDE_ESTABLISHING',
            duration: 5.5
          }
        ]
      },
      'ARJUNA_KARNA': {
        title: 'Arjuna & Karna (Vow of Honor)',
        char1Archetype: 'ARJUNA',
        char2Archetype: 'KARNA',
        castName: 'Arjuna & Karna',
        worldName: 'Kurukshetra War & Cosmic Realm',
        avatar: '🏹',
        scenes: [
          {
            env: 'KURUKSHETRA_BATTLEFIELD',
            speaker: 0,
            speakerName: 'Arjuna',
            text: 'कर्ण! आज कुरुक्षेत्र की भूमि पर हमारे धर्म और पराक्रम का अंतिम निर्णय होगा!',
            char1TargetX: -100,
            char2TargetX: 100,
            shot: 'DUTCH_LOW_ANGLE',
            duration: 6.0
          },
          {
            env: 'VOLCANIC_WAR',
            speaker: 1,
            speakerName: 'Karna',
            text: 'पार्थ, विजय किसी की भी हो, दानवीर कर्ण अपने वचनों से कभी पीछे नहीं हटा!',
            char1TargetX: -80,
            char2TargetX: 70,
            shot: 'HERO_CLOSEUP',
            duration: 6.0
          },
          {
            env: 'COSMIC_VOID',
            speaker: 0,
            speakerName: 'Arjuna',
            text: 'युद्ध इतिहास लिखता है, किंतु त्याग अमर गाथा बन जाता है!',
            char1TargetX: -40,
            char2TargetX: 40,
            shot: 'WIDE_ESTABLISHING',
            duration: 5.0
          }
        ]
      },
      'DEVI_YAKSHI': {
        title: 'Devi & Yakshi (Enchanted Grove)',
        char1Archetype: 'DEVI',
        char2Archetype: 'YAKSHI',
        castName: 'Devi & Yakshi',
        worldName: 'Enchanted Forest & Golden Temple',
        avatar: '🌸',
        scenes: [
          {
            env: 'ENCHANTED_FOREST',
            speaker: 1,
            speakerName: 'Yakshi',
            text: 'देवी! इस पावन अरण्य के वृक्ष और पुष्प आपके चरण स्पर्श से धन्य हुए।',
            char1TargetX: -90,
            char2TargetX: 90,
            shot: 'MEDIUM_ACTION',
            duration: 5.5
          },
          {
            env: 'GOLDEN_TEMPLE',
            speaker: 0,
            speakerName: 'Devi',
            text: 'प्रकृति और शक्ति एक ही सत्य के दो रूप हैं, कल्याणी।',
            char1TargetX: -50,
            char2TargetX: 80,
            shot: 'HERO_CLOSEUP',
            duration: 5.0
          },
          {
            env: 'SACRED_ASHRAMA',
            speaker: 0,
            speakerName: 'Devi',
            text: 'जहाँ करुणा और भक्ति है, वहीं संपूर्ण जगत का कल्याण निहित है।',
            char1TargetX: 0,
            char2TargetX: 100,
            shot: 'WIDE_ESTABLISHING',
            duration: 5.5
          }
        ]
      }
    };

    this.currentStoryKey = 'SHESHANAGA_VASUKI';
    this.currentSceneIndex = 0;
    this.activeScriptScenes = [];
    this.sceneTimer = null;

    this.init();
  }

  init() {
    this.bindEvents();

    // Default to Dual Mode so both characters are staged immediately
    this.director.setDualMode(true);
    this.director.setEnvironment('HIMALAYAN_SUMMIT');

    // Force first render so character is immediately 100% visible
    this.director.render(0.016);

    // Start continuous animation loop
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  bindEvents() {
    // 1. Preset Story Chips
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const key = chip.getAttribute('data-story');
        this.selectStoryPreset(key);
      });
    });

    // 2. Main "Create Video" / Generate Button
    const genBtn = document.getElementById('btn-generate-topic-story');
    if (genBtn) {
      genBtn.addEventListener('click', () => {
        const topic = document.getElementById('input-story-topic')?.value?.trim();
        if (!topic) {
          alert('Please enter a story topic or idea!');
          return;
        }
        this.generateAndPlayStory(topic);
      });
    }

    // 3. Play / Pause Button
    const playBtn = document.getElementById('btn-play-pause');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (this.isPlaying || this.isStorySequencePlaying) {
          this.pause();
        } else {
          // Play current story preset
          const preset = this.storyPresets[this.currentStoryKey];
          if (preset) {
            this.playMultiSceneStory(preset);
          } else {
            this.playActiveLine();
          }
        }
      });
    }

    // 4. Surprise Me (Randomize Cast)
    const randBtn = document.getElementById('btn-randomize-char');
    if (randBtn) {
      randBtn.addEventListener('click', () => {
        const p1 = this.char1.randomizeNewCharacter();
        const p2 = this.char2.randomizeNewCharacter();
        const castElem = document.getElementById('cast-display-name');
        if (castElem) castElem.textContent = `Custom Cast: ${p1.name} & ${p2.name}`;
        this.showToast(`🎲 Generated unique characters: ${p1.name} & ${p2.name}!`);
      });
    }

    // 5. Hero Archetype Dropdown
    const selectHero = document.getElementById('select-hero-archetype');
    if (selectHero) {
      selectHero.addEventListener('change', (e) => {
        this.char1.setArchetype(e.target.value);
        this.showToast(`Hero updated to: ${this.char1.profile.name}`);
      });
    }

    // 6. Background World Dropdown
    const selectEnv = document.getElementById('select-env');
    if (selectEnv) {
      selectEnv.addEventListener('change', (e) => {
        this.director.setEnvironment(e.target.value);
        this.showToast(`Transitioning world to: ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    // 7. Subtitle Input Box
    const subtitleInput = document.getElementById('input-subtitle-text');
    if (subtitleInput) {
      subtitleInput.addEventListener('input', (e) => {
        this.director.setSubtitle(e.target.value, this.char1.profile.name);
      });
    }

    // 8. Microphone Recording
    const micBtn = document.getElementById('btn-record-mic');
    if (micBtn) {
      micBtn.addEventListener('click', async () => {
        if (this.audioStudio.isRecordingMic) {
          this.audioStudio.stopMicRecording();
          micBtn.innerHTML = '<span>🎙️</span> <span>Record My Voice</span>';
          this.showToast('Voice recorded! Press Play to watch your character speak.');
        } else {
          const ok = await this.audioStudio.startMicRecording();
          if (ok) {
            micBtn.innerHTML = '<span>⏹</span> <span>Stop Recording</span>';
            this.showToast('Recording... speak naturally into your microphone!');
          } else {
            this.showToast('Microphone not accessible. Please check browser permissions.');
          }
        }
      });
    }

    // 9. Custom Audio Upload
    const audioUpload = document.getElementById('input-upload-audio');
    if (audioUpload) {
      audioUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const ok = await this.audioStudio.loadCustomAudioFile(file);
        if (ok) {
          this.showToast(`Loaded audio track: ${file.name}`);
        }
      });
    }

    // 10. Video Recording & Export
    const recordVideoBtn = document.getElementById('btn-record-video');
    if (recordVideoBtn) {
      recordVideoBtn.addEventListener('click', () => {
        if (this.isRecordingVideo) {
          this.stopVideoRecording();
        } else {
          this.startVideoRecording();
        }
      });
    }
  }

  selectStoryPreset(key) {
    this.currentStoryKey = key;
    const preset = this.storyPresets[key];
    if (!preset) return;

    // Update Banner
    const castElem = document.getElementById('cast-display-name');
    if (castElem) castElem.textContent = `Active Cast: ${preset.castName}`;
    const worldElem = document.getElementById('world-display-name');
    if (worldElem) worldElem.textContent = `World: ${preset.worldName}`;
    const avatarElem = document.getElementById('cast-avatar-icon');
    if (avatarElem) avatarElem.textContent = preset.avatar || '👑';

    // Update Topic Input
    const topicInput = document.getElementById('input-story-topic');
    if (topicInput) topicInput.value = preset.title;

    // Configure Characters & Environment
    this.char1.setArchetype(preset.char1Archetype);
    this.char2.setArchetype(preset.char2Archetype);

    const firstScene = preset.scenes[0];
    if (firstScene) {
      this.director.setEnvironment(firstScene.env);
      const subInput = document.getElementById('input-subtitle-text');
      if (subInput) subInput.value = firstScene.text;
      this.director.setSubtitle(firstScene.text, firstScene.speakerName);
    }

    this.showToast(`Loaded: ${preset.title}`);
  }

  playActiveLine() {
    const line = document.getElementById('input-subtitle-text')?.value || this.director.activeSubtitle;
    const speaker = this.char1.profile.name || 'Hero';
    this.director.setSubtitle(line, speaker);

    this.isPlaying = true;
    const playBtn = document.getElementById('btn-play-pause');
    if (playBtn) playBtn.textContent = '⏸ Pause';

    this.audioStudio.speakText(line, { pitch: 0.95, rate: 0.95, lang: 'hi-IN' }, () => {
      this.isPlaying = false;
      if (playBtn) playBtn.textContent = '▶ Play Animated Story';
    });
  }

  pause() {
    this.isPlaying = false;
    this.isStorySequencePlaying = false;
    if (this.sceneTimer) clearTimeout(this.sceneTimer);
    this.audioStudio.stopVoice();
    const playBtn = document.getElementById('btn-play-pause');
    if (playBtn) playBtn.textContent = '▶ Play Animated Story';
  }

  /**
   * Automated Multi-Scene Story Player
   */
  async playMultiSceneStory(storyData) {
    this.pause();
    this.isStorySequencePlaying = true;

    if (storyData.char1Archetype) this.char1.setArchetype(storyData.char1Archetype);
    if (storyData.char2Archetype) this.char2.setArchetype(storyData.char2Archetype);

    this.director.setDualMode(true);
    this.activeScriptScenes = storyData.scenes || [];
    this.currentSceneIndex = 0;

    const playBtn = document.getElementById('btn-play-pause');
    if (playBtn) playBtn.textContent = '⏸ Pause';

    this.showToast(`🎬 Directing: ${storyData.title}`);
    await this.executeStoryScene(this.currentSceneIndex);
  }

  async executeStoryScene(index) {
    if (!this.isStorySequencePlaying || index >= this.activeScriptScenes.length) {
      this.isStorySequencePlaying = false;
      this.showToast('✨ Story complete!');
      const playBtn = document.getElementById('btn-play-pause');
      if (playBtn) playBtn.textContent = '▶ Play Animated Story';
      return;
    }

    const scene = this.activeScriptScenes[index];
    this.currentSceneIndex = index;

    // 1. Transition Environment
    if (scene.env) {
      this.director.setEnvironment(scene.env);
      const selectEnv = document.getElementById('select-env');
      if (selectEnv) selectEnv.value = scene.env;
    }

    // 2. Camera Shot
    if (scene.shot) {
      this.director.setShotMode(scene.shot);
    }

    // 3. Move characters into position with natural walking kinematics
    if (scene.char1TargetX !== undefined) {
      this.char1.moveTo(scene.char1TargetX, 130);
    }
    if (scene.char2TargetX !== undefined) {
      this.char2.moveTo(scene.char2TargetX, 130);
    }

    // 4. Set Active Speaker & Subtitle
    const speakerIdx = scene.speaker || 0;
    this.director.setActiveSpeaker(speakerIdx, scene.speakerName);
    this.director.setSubtitle(scene.text, scene.speakerName);

    const subInput = document.getElementById('input-subtitle-text');
    if (subInput) subInput.value = scene.text;

    // 5. Play Spoken Dialogue with Lip-Sync
    this.audioStudio.speakText(scene.text, {
      pitch: speakerIdx === 0 ? 0.90 : 1.08,
      rate: 0.94,
      lang: 'hi-IN'
    }, () => {
      // Scene finished, transition to next scene after 1s
      if (this.isStorySequencePlaying) {
        this.sceneTimer = setTimeout(() => {
          this.executeStoryScene(index + 1);
        }, 1100);
      }
    });
  }

  /**
   * One-Click AI Story Generation from Prompt
   */
  async generateAndPlayStory(topic) {
    const btn = document.getElementById('btn-generate-topic-story');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>⚡</span> <span>Directing...</span>';
    }

    const tLower = topic.toLowerCase();
    let env1 = 'GOLDEN_TEMPLE';
    let env2 = 'SACRED_ASHRAMA';
    let env3 = 'COSMIC_VOID';
    let c1 = 'RUDRA';
    let c2 = 'RISHI';

    if (tLower.includes('war') || tLower.includes('battle') || tLower.includes('yuddha') || tLower.includes('fight')) {
      env1 = 'KURUKSHETRA_BATTLEFIELD';
      env2 = 'VOLCANIC_WAR';
      env3 = 'COSMIC_VOID';
      c1 = 'ARJUNA';
      c2 = 'KARNA';
    } else if (tLower.includes('forest') || tLower.includes('tree') || tLower.includes('nature') || tLower.includes('beauty')) {
      env1 = 'ENCHANTED_FOREST';
      env2 = 'SACRED_ASHRAMA';
      env3 = 'GOLDEN_TEMPLE';
      c1 = 'DEVI';
      c2 = 'YAKSHI';
    } else if (tLower.includes('serpent') || tLower.includes('snake') || tLower.includes('nag') || tLower.includes('ocean')) {
      env1 = 'HIMALAYAN_SUMMIT';
      env2 = 'COSMIC_VOID';
      env3 = 'GOLDEN_TEMPLE';
      c1 = 'SHESHANAGA';
      c2 = 'VASUKI';
    } else if (tLower.includes('wisdom') || tLower.includes('meditation') || tLower.includes('sage') || tLower.includes('guru')) {
      env1 = 'SACRED_ASHRAMA';
      env2 = 'HIMALAYAN_SUMMIT';
      env3 = 'ROYAL_DARBAR';
      c1 = 'RISHI';
      c2 = 'SHISHYA';
    }

    const autoStory = {
      title: topic,
      char1Archetype: c1,
      char2Archetype: c2,
      castName: `${c1} & ${c2}`,
      worldName: `${env1.replace(/_/g, ' ')} & ${env2.replace(/_/g, ' ')}`,
      avatar: '✨',
      scenes: [
        {
          env: env1,
          speaker: 0,
          speakerName: c1,
          text: `प्राचीन गाथाओं में वर्णित है... ${topic}!`,
          char1TargetX: -100,
          char2TargetX: 100,
          shot: 'WIDE_ESTABLISHING',
          duration: 5.5
        },
        {
          env: env2,
          speaker: 1,
          speakerName: c2,
          text: `समय के इस पावन मोड़ पर, सत्य और पराक्रम की परीक्षा होगी।`,
          char1TargetX: -70,
          char2TargetX: 70,
          shot: 'HERO_CLOSEUP',
          duration: 6.0
        },
        {
          env: env3,
          speaker: 0,
          speakerName: c1,
          text: `और इसी प्रकार ब्रह्मांड ने अपने सनातन धर्म को पुनः स्थापित किया!`,
          char1TargetX: -35,
          char2TargetX: 35,
          shot: 'MEDIUM_ACTION',
          duration: 5.5
        }
      ]
    };

    // Update banner
    const castElem = document.getElementById('cast-display-name');
    if (castElem) castElem.textContent = `Active Cast: ${autoStory.castName}`;
    const worldElem = document.getElementById('world-display-name');
    if (worldElem) worldElem.textContent = `World: ${autoStory.worldName}`;

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>✨</span> <span>Create Video</span>';
    }

    await this.playMultiSceneStory(autoStory);
  }

  /**
   * 9:16 Video Recording & Export
   */
  startVideoRecording() {
    try {
      const stream = this.canvas.captureStream(30);
      if (this.audioStudio.destinationNode) {
        const audioTracks = this.audioStudio.destinationNode.stream.getAudioTracks();
        if (audioTracks.length > 0) stream.addTrack(audioTracks[0]);
      }

      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4000000 });

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ManoLab_Visual_Story_${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('✅ 9:16 Video downloaded to your device!');
      };

      this.mediaRecorder.start();
      this.isRecordingVideo = true;

      const recBadge = document.getElementById('recording-badge');
      if (recBadge) recBadge.classList.add('visible');

      const btn = document.getElementById('btn-record-video');
      if (btn) btn.innerHTML = '<span>⏹</span> <span>Stop Recording & Save</span>';

      this.showToast('🔴 Recording 9:16 video...');
    } catch (e) {
      alert('Video recording error: ' + e.message);
    }
  }

  stopVideoRecording() {
    if (this.mediaRecorder && this.isRecordingVideo) {
      this.mediaRecorder.stop();
      this.isRecordingVideo = false;

      const recBadge = document.getElementById('recording-badge');
      if (recBadge) recBadge.classList.remove('visible');

      const btn = document.getElementById('btn-record-video');
      if (btn) btn.innerHTML = '<span>⬇</span> <span>Export 9:16 Video (MP4 / WebM)</span>';
    }
  }

  showToast(msg) {
    const toast = document.getElementById('toast-notice');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  renderLoop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.director.render(dt);

    requestAnimationFrame(this.renderLoop.bind(this));
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  window.storyStudioApp = new StoryStudioApp();
});
