/**
 * VISUAL STORY GENERATOR - MANO LAB
 * story-studio.js - Studio Controller, Multi-Character Staging, Story Sequencer & Video Exporter
 */

class StoryStudioApp {
  constructor() {
    this.canvas = document.getElementById('story-canvas');
    this.char1 = new CharacterRig('RUDRA');
    this.char2 = new CharacterRig('MYSTIC_SAGE');
    this.audioStudio = new AudioStudio();
    this.director = new SceneDirector(this.canvas, this.char1, this.audioStudio, this.char2);

    this.isPlaying = false;
    this.isStorySequencePlaying = false;
    this.activeCharIndex = 0; // 0 = editing Char 1, 1 = editing Char 2

    this.lastTime = performance.now();
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecordingVideo = false;

    // Built-in Cinematic Multi-Scene Story Presets
    this.storyPresets = {
      'SHESHANAGA_VASUKI': {
        title: 'The Eternal Brothers: Sheshanaga & Vasuki',
        char1Archetype: 'SHESHANAGA',
        char2Archetype: 'VASUKI',
        scenes: [
          {
            env: 'HIMALAYAN_SUMMIT',
            speaker: 0,
            speakerName: 'Sheshanaga',
            text: 'एक ही माँ के दो अमर पुत्र... शेषनाग और वासुकि!',
            char1TargetX: -100,
            char2TargetX: 100,
            shot: 'WIDE_ESTABLISHING',
            duration: 5.5
          },
          {
            env: 'COSMIC_VOID',
            speaker: 1,
            speakerName: 'Vasuki',
            text: 'क्षीर सागर के मंथन में मैंने मंदराचल को थामा, और तुमने अनंत शय्या बनाई।',
            char1TargetX: -80,
            char2TargetX: 80,
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
        title: 'Cosmic Dialogue: Rudra & Rishi',
        char1Archetype: 'RUDRA',
        char2Archetype: 'RISHI',
        scenes: [
          {
            env: 'SACRED_ASHRAMA',
            speaker: 1,
            speakerName: 'Rishi',
            text: 'हे महादेव! सृष्टि और महाप्रलय के मध्य काल का क्या रहस्य है?',
            char1TargetX: -110,
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
            char2TargetX: 110,
            shot: 'HERO_CLOSEUP',
            duration: 6.5
          },
          {
            env: 'HIMALAYAN_SUMMIT',
            speaker: 0,
            speakerName: 'Rudra',
            text: 'जब तांडव शांत होगा, तब केवल शून्य और विशुद्ध चेतना शेष रहेगी।',
            char1TargetX: 0,
            char2TargetX: 130,
            shot: 'WIDE_ESTABLISHING',
            duration: 5.5
          }
        ]
      },
      'ARJUNA_KARNA': {
        title: 'The Vow of Honor: Arjuna & Karna',
        char1Archetype: 'ARJUNA',
        char2Archetype: 'KARNA',
        scenes: [
          {
            env: 'KURUKSHETRA_BATTLEFIELD',
            speaker: 0,
            speakerName: 'Arjuna',
            text: 'कर्ण! आज कुरुक्षेत्र की भूमि पर हमारे धर्म और पराक्रम का अंतिम निर्णय होगा!',
            char1TargetX: -110,
            char2TargetX: 110,
            shot: 'DUTCH_LOW_ANGLE',
            duration: 6.0
          },
          {
            env: 'VOLCANIC_WAR',
            speaker: 1,
            speakerName: 'Karna',
            text: 'पार्थ, विजय किसी की भी हो, दानवीर कर्ण अपने वचनों से कभी पीछे नहीं हटा!',
            char1TargetX: -100,
            char2TargetX: 70,
            shot: 'HERO_CLOSEUP',
            duration: 6.0
          },
          {
            env: 'COSMIC_VOID',
            speaker: 0,
            speakerName: 'Arjuna',
            text: 'युद्ध इतिहास लिखता है, किंतु त्याग अमर गाथा बन जाता है!',
            char1TargetX: -50,
            char2TargetX: 50,
            shot: 'WIDE_ESTABLISHING',
            duration: 5.0
          }
        ]
      },
      'DEVI_YAKSHI': {
        title: 'Divine Radiance: Devi & Yakshi',
        char1Archetype: 'DEVI',
        char2Archetype: 'YAKSHI',
        scenes: [
          {
            env: 'ENCHANTED_FOREST',
            speaker: 1,
            speakerName: 'Yakshi',
            text: 'देवी! इस पावन अरण्य के वृक्ष और पुष्प आपके चरण स्पर्श से धन्य हुए।',
            char1TargetX: -90,
            char2TargetX: 100,
            shot: 'MEDIUM_ACTION',
            duration: 5.5
          },
          {
            env: 'GOLDEN_TEMPLE',
            speaker: 0,
            speakerName: 'Devi',
            text: 'प्रकृति और शक्ति एक ही सत्य के दो रूप हैं, कल्याणी।',
            char1TargetX: -50,
            char2TargetX: 90,
            shot: 'HERO_CLOSEUP',
            duration: 5.0
          },
          {
            env: 'SACRED_ASHRAMA',
            speaker: 0,
            speakerName: 'Devi',
            text: 'जहाँ करुणा और भक्ति है, वहीं संपूर्ण जगत का कल्याण निहित है।',
            char1TargetX: 0,
            char2TargetX: 120,
            shot: 'WIDE_ESTABLISHING',
            duration: 5.5
          }
        ]
      }
    };

    this.currentSceneIndex = 0;
    this.activeScriptScenes = [];
    this.sceneTimer = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateActiveCharacterUI();
    this.director.render(0.016);
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  get activeCharacter() {
    return this.activeCharIndex === 0 ? this.char1 : this.char2;
  }

  bindEvents() {
    // 1. Archetype selection for active character
    document.querySelectorAll('.btn-archetype').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-archetype').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.getAttribute('data-archetype');
        this.activeCharacter.setArchetype(type);
        this.updateActiveCharacterUI();
        this.showToast(`Character ${this.activeCharIndex + 1} switched to: ${this.activeCharacter.profile.name}`);
      });
    });

    // 2. Randomize Character Button (Infinite parametric variety!)
    const randBtn = document.getElementById('btn-randomize-char');
    if (randBtn) {
      randBtn.addEventListener('click', () => {
        const p = this.activeCharacter.randomizeNewCharacter();
        this.updateActiveCharacterUI();
        this.showToast(`🎲 Generated unique character: ${p.name}!`);
      });
    }

    // 3. Character Switcher Tabs (Editing Char 1 vs Char 2)
    const tabChar1 = document.getElementById('tab-edit-char1');
    const tabChar2 = document.getElementById('tab-edit-char2');
    if (tabChar1 && tabChar2) {
      tabChar1.addEventListener('click', () => {
        this.activeCharIndex = 0;
        tabChar1.classList.add('active');
        tabChar2.classList.remove('active');
        this.updateActiveCharacterUI();
      });
      tabChar2.addEventListener('click', () => {
        this.activeCharIndex = 1;
        tabChar2.classList.add('active');
        tabChar1.classList.remove('active');
        this.updateActiveCharacterUI();
      });
    }

    // 4. Staging Mode Toggle: Solo Hero vs Dual-Character Scene
    const stageToggle = document.getElementById('select-staging-mode');
    if (stageToggle) {
      stageToggle.addEventListener('change', (e) => {
        const isDual = e.target.value === 'DUAL_SCENE';
        this.director.setDualMode(isDual);
        const char2Tab = document.getElementById('tab-edit-char2');
        if (char2Tab) char2Tab.style.display = isDual ? 'inline-flex' : 'none';
        this.showToast(isDual ? 'Dual-Character Staging Activated!' : 'Solo Hero Mode Activated');
      });
    }

    // 5. Active Speaker Selector in Dual Mode
    const speakerToggle = document.getElementById('select-active-speaker');
    if (speakerToggle) {
      speakerToggle.addEventListener('change', (e) => {
        const idx = parseInt(e.target.value, 10) || 0;
        this.director.setActiveSpeaker(idx);
        this.showToast(`Active Speaker: Character ${idx + 1}`);
      });
    }

    // 6. Locomotion Movement Controls
    const btnWalkLeft = document.getElementById('btn-walk-left');
    const btnWalkCenter = document.getElementById('btn-walk-center');
    const btnWalkRight = document.getElementById('btn-walk-right');
    const btnFlipFace = document.getElementById('btn-flip-facing');

    if (btnWalkLeft) {
      btnWalkLeft.addEventListener('click', () => {
        const target = this.director.isDualMode ? -130 : -100;
        this.activeCharacter.moveTo(target, 150);
        this.showToast(`Character ${this.activeCharIndex + 1} walking left...`);
      });
    }
    if (btnWalkCenter) {
      btnWalkCenter.addEventListener('click', () => {
        this.activeCharacter.moveTo(0, 150);
        this.showToast(`Character ${this.activeCharIndex + 1} moving to center stage...`);
      });
    }
    if (btnWalkRight) {
      btnWalkRight.addEventListener('click', () => {
        const target = this.director.isDualMode ? 130 : 100;
        this.activeCharacter.moveTo(target, 150);
        this.showToast(`Character ${this.activeCharIndex + 1} walking right...`);
      });
    }
    if (btnFlipFace) {
      btnFlipFace.addEventListener('click', () => {
        this.activeCharacter.facing *= -1;
        this.showToast(`Character ${this.activeCharIndex + 1} facing direction flipped`);
      });
    }

    // 7. Live Character Customizer Sliders & Pickers
    const sliderEyeSize = document.getElementById('slider-eye-size');
    if (sliderEyeSize) {
      sliderEyeSize.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 1.0;
        this.activeCharacter.profile.eyeSize = val;
        document.getElementById('lbl-eye-size').textContent = `${val.toFixed(1)}x`;
      });
    }

    const selectCrown = document.getElementById('select-crown-type');
    if (selectCrown) {
      selectCrown.addEventListener('change', (e) => {
        this.activeCharacter.profile.crown = e.target.value;
      });
    }

    const selectSkin = document.getElementById('select-skin-tone');
    if (selectSkin) {
      selectSkin.addEventListener('change', (e) => {
        this.applySkinPalette(this.activeCharacter, e.target.value);
      });
    }

    // 8. Dynamic Environment Selector (8 Environments)
    const selectEnv = document.getElementById('select-env');
    if (selectEnv) {
      selectEnv.addEventListener('change', (e) => {
        this.director.setEnvironment(e.target.value);
        this.showToast(`Transitioning background to: ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    // 9. Camera Shot Switcher Buttons
    document.querySelectorAll('.btn-shot').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-shot').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const shot = btn.getAttribute('data-shot');
        this.director.setShotMode(shot);
      });
    });

    // 10. Voice FX Preset Select
    const voiceSelect = document.getElementById('select-voice-fx');
    if (voiceSelect) {
      voiceSelect.addEventListener('change', (e) => {
        this.audioStudio.setPresetVoiceFX(e.target.value);
        this.showToast(`Studio Voice FX: ${e.target.value}`);
      });
    }

    // 11. Custom Subtitle Input
    const subtitleInput = document.getElementById('input-subtitle-text');
    if (subtitleInput) {
      subtitleInput.addEventListener('input', (e) => {
        this.director.setSubtitle(e.target.value, this.activeCharacter.profile.name);
      });
    }

    // 12. Single Line Play / Stop Button
    const playBtn = document.getElementById('btn-play-pause');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (this.isPlaying) {
          this.pause();
          playBtn.textContent = '▶ Play Narration';
        } else {
          this.playActiveLine();
          playBtn.textContent = '⏸ Pause';
        }
      });
    }

    // 13. Preset Story Select & Play
    const presetSelect = document.getElementById('select-story-preset');
    const playPresetBtn = document.getElementById('btn-play-preset-story');
    if (playPresetBtn && presetSelect) {
      playPresetBtn.addEventListener('click', () => {
        const key = presetSelect.value;
        const preset = this.storyPresets[key];
        if (preset) {
          this.playMultiSceneStory(preset);
        }
      });
    }

    // 14. Custom Topic Story Generator
    const btnGenTopic = document.getElementById('btn-generate-topic-story');
    const inputTopic = document.getElementById('input-story-topic');
    if (btnGenTopic && inputTopic) {
      btnGenTopic.addEventListener('click', async () => {
        const topic = inputTopic.value.trim();
        if (!topic) {
          alert('Please enter a topic or theme for the story!');
          return;
        }
        await this.generateStoryFromTopic(topic);
      });
    }

    // 15. Mic Recording Button
    const micBtn = document.getElementById('btn-record-mic');
    if (micBtn) {
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
    }

    // 16. Custom Audio File Upload
    const audioUpload = document.getElementById('input-upload-audio');
    if (audioUpload) {
      audioUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const ok = await this.audioStudio.loadCustomAudioFile(file);
        if (ok) {
          this.showToast(`Custom audio loaded: ${file.name}`);
        } else {
          this.showToast('Could not decode audio file.');
        }
      });
    }

    // 17. 9:16 Video Recording & Export
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

  applySkinPalette(character, paletteKey) {
    const palettes = {
      ASH_BLUE: { base: '#3b5368', highlight: '#5c7d99', shadow: '#1e2c38', rim: '#93c5fd' },
      WHEATISH: { base: '#b46e45', highlight: '#d98e64', shadow: '#784325', rim: '#fed7aa' },
      OBSIDIAN: { base: '#452b36', highlight: '#694152', shadow: '#26161e', rim: '#f43f5e' },
      GOLDEN: { base: '#e6a66b', highlight: '#fcd34d', shadow: '#9a5c2d', rim: '#fef08a' },
      EMERALD: { base: '#1b4d4f', highlight: '#2dd4bf', shadow: '#0f292a', rim: '#5eead4' },
      SAPPHIRE: { base: '#253d6e', highlight: '#60a5fa', shadow: '#172554', rim: '#bfdbfe' },
      PEACH: { base: '#f6d5c2', highlight: '#fff1eb', shadow: '#cca28c', rim: '#fecdd3' }
    };
    if (palettes[paletteKey]) {
      character.profile.skin = palettes[paletteKey];
    }
  }

  updateActiveCharacterUI() {
    const char = this.activeCharacter;
    const p = char.profile;

    // Update active button highlight in archetype list
    document.querySelectorAll('.btn-archetype').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-archetype') === p.id);
    });

    // Update sliders
    const eyeSlider = document.getElementById('slider-eye-size');
    if (eyeSlider) eyeSlider.value = p.eyeSize || 1.0;
    const eyeLbl = document.getElementById('lbl-eye-size');
    if (eyeLbl) eyeLbl.textContent = `${(p.eyeSize || 1.0).toFixed(1)}x`;

    const crownSelect = document.getElementById('select-crown-type');
    if (crownSelect) crownSelect.value = p.crown || 'ROYAL_CROWN';

    // Update speaker name pill
    const nameInput = document.getElementById('input-speaker-name');
    if (nameInput) nameInput.value = p.name;
  }

  playActiveLine() {
    const line = document.getElementById('input-subtitle-text')?.value || this.director.activeSubtitle;
    const speaker = this.activeCharacter.profile.name || 'Hero';
    this.director.setSubtitle(line, speaker);

    this.isPlaying = true;
    const playBtn = document.getElementById('btn-play-pause');
    if (playBtn) playBtn.textContent = '⏸ Pause';

    this.audioStudio.speakText(line, {
      pitch: this.activeCharIndex === 0 ? 0.92 : 1.05,
      rate: 0.95,
      lang: 'hi-IN'
    }, () => {
      this.isPlaying = false;
      if (playBtn) playBtn.textContent = '▶ Play Narration';
    });
  }

  pause() {
    this.isPlaying = false;
    this.isStorySequencePlaying = false;
    if (this.sceneTimer) clearTimeout(this.sceneTimer);
    this.audioStudio.stopVoice();
    const playBtn = document.getElementById('btn-play-pause');
    if (playBtn) playBtn.textContent = '▶ Play Narration';
  }

  /**
   * Multi-scene Orchestrator:
   * Transitions backgrounds, stages characters, walks them, and alternates dialogue
   */
  async playMultiSceneStory(storyData) {
    this.pause();
    this.isStorySequencePlaying = true;

    // Configure character archetypes
    if (storyData.char1Archetype) this.char1.setArchetype(storyData.char1Archetype);
    if (storyData.char2Archetype) this.char2.setArchetype(storyData.char2Archetype);

    // Switch to Dual-Scene mode
    this.director.setDualMode(true);
    const stageToggle = document.getElementById('select-staging-mode');
    if (stageToggle) stageToggle.value = 'DUAL_SCENE';

    this.activeScriptScenes = storyData.scenes || [];
    this.currentSceneIndex = 0;

    this.showToast(`🎬 Starting Story: ${storyData.title}`);
    await this.executeStoryScene(this.currentSceneIndex);
  }

  async executeStoryScene(index) {
    if (!this.isStorySequencePlaying || index >= this.activeScriptScenes.length) {
      this.isStorySequencePlaying = false;
      this.showToast('✨ Story complete!');
      const playBtn = document.getElementById('btn-play-pause');
      if (playBtn) playBtn.textContent = '▶ Play Narration';
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

    // 3. Move characters to scene target positions
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

    // Update active speaker selector
    const speakerToggle = document.getElementById('select-active-speaker');
    if (speakerToggle) speakerToggle.value = String(speakerIdx);

    // Update subtitle input text box
    const subInput = document.getElementById('input-subtitle-text');
    if (subInput) subInput.value = scene.text;

    // 5. Play Dialogue Speech
    this.audioStudio.speakText(scene.text, {
      pitch: speakerIdx === 0 ? 0.90 : 1.08,
      rate: 0.94,
      lang: 'hi-IN'
    }, () => {
      // Scene dialogue finished! Wait 1.0s before moving to next scene
      if (this.isStorySequencePlaying) {
        this.sceneTimer = setTimeout(() => {
          this.executeStoryScene(index + 1);
        }, 1100);
      }
    });
  }

  /**
   * Procedural Story Generator from user topic
   */
  async generateStoryFromTopic(topic) {
    const btn = document.getElementById('btn-generate-topic-story');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>⚡</span> <span>Generating Scenes...</span>';
    }

    const tLower = topic.toLowerCase();

    // Smart thematic character and background mapper
    let env1 = 'GOLDEN_TEMPLE';
    let env2 = 'SACRED_ASHRAMA';
    let env3 = 'COSMIC_VOID';
    let c1 = 'RUDRA';
    let c2 = 'RISHI';

    if (tLower.includes('war') || tLower.includes('battle') || tLower.includes('fight') || tLower.includes('yuddha')) {
      env1 = 'KURUKSHETRA_BATTLEFIELD';
      env2 = 'VOLCANIC_WAR';
      env3 = 'COSMIC_VOID';
      c1 = 'ARJUNA';
      c2 = 'KARNA';
    } else if (tLower.includes('forest') || tLower.includes('nature') || tLower.includes('tree') || tLower.includes('beauty')) {
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
    } else if (tLower.includes('wisdom') || tLower.includes('meditation') || tLower.includes('guru') || tLower.includes('student')) {
      env1 = 'SACRED_ASHRAMA';
      env2 = 'HIMALAYAN_SUMMIT';
      env3 = 'ROYAL_DARBAR';
      c1 = 'RISHI';
      c2 = 'SHISHYA';
    }

    const generatedStory = {
      title: `The Legend of: ${topic}`,
      char1Archetype: c1,
      char2Archetype: c2,
      scenes: [
        {
          env: env1,
          speaker: 0,
          speakerName: c1,
          text: `प्राचीन गाथाओं में वर्णित है... ${topic} का महान आरंभ!`,
          char1TargetX: -110,
          char2TargetX: 110,
          shot: 'WIDE_ESTABLISHING',
          duration: 5.5
        },
        {
          env: env2,
          speaker: 1,
          speakerName: c2,
          text: `समय के इस मोड़ पर, सत्य और संकल्प की सबसे बड़ी परीक्षा होगी।`,
          char1TargetX: -80,
          char2TargetX: 80,
          shot: 'HERO_CLOSEUP',
          duration: 6.0
        },
        {
          env: env3,
          speaker: 0,
          speakerName: c1,
          text: `और इसी प्रकार ब्रह्मांड ने अपने सनातन धर्म को पुनः स्थापित किया!`,
          char1TargetX: -40,
          char2TargetX: 40,
          shot: 'MEDIUM_ACTION',
          duration: 5.5
        }
      ]
    };

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>✨</span> <span>Generate & Direct Story</span>';
    }

    await this.playMultiSceneStory(generatedStory);
  }

  /**
   * 9:16 Vertical Video Recording & Export
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
        this.showToast('✅ 9:16 Video successfully downloaded!');
      };

      this.mediaRecorder.start();
      this.isRecordingVideo = true;

      const recBadge = document.getElementById('recording-badge');
      if (recBadge) recBadge.classList.add('visible');

      const btn = document.getElementById('btn-record-video');
      if (btn) btn.innerHTML = '<span>⏹</span> <span>Stop Recording & Save</span>';

      this.showToast('🔴 Recording 9:16 video... play your story or voiceover!');
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
      if (btn) btn.innerHTML = '<span>🔴</span> <span>Record & Export 9:16 Video</span>';
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
