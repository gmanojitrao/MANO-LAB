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

    // Default to modern neutral characters
    this.char1 = new CharRig('ALEX');
    this.char2 = new CharRig('MAYA');
    this.audioStudio = new AudStudio();
    this.director = new ScnDirector(this.canvas, this.char1, this.audioStudio, this.char2);

    this.isPlaying = false;
    this.isStorySequencePlaying = false;
    this.lastTime = performance.now();
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecordingVideo = false;

    this.activeCharToEdit = 1; // 1 or 2

    // Curated Neutral Modern Story Presets
    this.storyPresets = {
      'TECH_PODCAST': {
        title: 'AI & Human Creativity',
        char1Archetype: 'ALEX',
        char2Archetype: 'MAYA',
        castName: 'Alex & Maya',
        worldName: 'Podcast Studio',
        avatar: '🎙️',
        scenes: [
          {
            env: 'PODCAST_STUDIO',
            speaker: 0,
            speakerName: 'Alex',
            text: 'Welcome back! Today we are discussing: can AI expand human imagination?',
            char1TargetX: -80,
            char2TargetX: 80,
            shot: 'WIDE_ESTABLISHING',
            duration: 5.5
          },
          {
            env: 'PODCAST_STUDIO',
            speaker: 1,
            speakerName: 'Maya',
            text: 'Technology does not replace the artist. It removes friction and amplifies great ideas.',
            char1TargetX: -65,
            char2TargetX: 65,
            shot: 'HERO_CLOSEUP',
            duration: 6.0
          },
          {
            env: 'PODCAST_STUDIO',
            speaker: 0,
            speakerName: 'Alex',
            text: 'Exactly. The best stories will always come from genuine human feelings and truth.',
            char1TargetX: -45,
            char2TargetX: 45,
            shot: 'MEDIUM_ACTION',
            duration: 5.5
          }
        ]
      },

      'COFFEE_CHAT': {
        title: 'The Morning Routine',
        char1Archetype: 'SAM',
        char2Archetype: 'PRIYA',
        castName: 'Sam & Priya',
        worldName: 'Cozy Coffee Shop',
        avatar: '☕',
        scenes: [
          {
            env: 'COFFEE_SHOP',
            speaker: 0,
            speakerName: 'Sam',
            text: 'I used to think waking up at 5 AM was the only way to be productive.',
            char1TargetX: -85,
            char2TargetX: 85,
            shot: 'WIDE_ESTABLISHING',
            duration: 5.2
          },
          {
            env: 'COFFEE_SHOP',
            speaker: 1,
            speakerName: 'Priya',
            text: 'Honestly, starting your morning with a quiet coffee and zero notifications is 10 times better!',
            char1TargetX: -60,
            char2TargetX: 70,
            shot: 'HERO_CLOSEUP',
            duration: 6.0
          },
          {
            env: 'COFFEE_SHOP',
            speaker: 0,
            speakerName: 'Sam',
            text: 'Could not agree more. Protecting your morning peace is the best life hack.',
            char1TargetX: -40,
            char2TargetX: 40,
            shot: 'MEDIUM_ACTION',
            duration: 5.5
          }
        ]
      },

      'CAREER_LEAP': {
        title: 'Taking the Next Leap',
        char1Archetype: 'DAVID',
        char2Archetype: 'ELENA',
        castName: 'David & Elena',
        worldName: 'City Sunset',
        avatar: '🌆',
        scenes: [
          {
            env: 'CITY_SUNSET',
            speaker: 1,
            speakerName: 'Elena',
            text: 'I have been thinking about launching my own creative project for months.',
            char1TargetX: -90,
            char2TargetX: 90,
            shot: 'WIDE_ESTABLISHING',
            duration: 5.5
          },
          {
            env: 'CITY_SUNSET',
            speaker: 0,
            speakerName: 'David',
            text: 'The best time to start was yesterday. The next best time is right now.',
            char1TargetX: -60,
            char2TargetX: 60,
            shot: 'HERO_CLOSEUP',
            duration: 5.5
          },
          {
            env: 'CITY_SUNSET',
            speaker: 1,
            speakerName: 'Elena',
            text: 'You are right. No more waiting for perfection—let us take the leap!',
            char1TargetX: -35,
            char2TargetX: 35,
            shot: 'MEDIUM_ACTION',
            duration: 5.0
          }
        ]
      },

      'SCIENCE_HABITS': {
        title: 'Curiosity & Small Wins',
        char1Archetype: 'ROHAN',
        char2Archetype: 'ZOE',
        castName: 'Rohan & Zoe',
        worldName: 'Minimalist Stage',
        avatar: '💡',
        scenes: [
          {
            env: 'MINIMALIST_STAGE',
            speaker: 0,
            speakerName: 'Rohan',
            text: 'Did you know improving just one percent every day makes you 37 times better in a year?',
            char1TargetX: -80,
            char2TargetX: 80,
            shot: 'WIDE_ESTABLISHING',
            duration: 5.8
          },
          {
            env: 'MINIMALIST_STAGE',
            speaker: 1,
            speakerName: 'Zoe',
            text: 'Compounding habits! Consistent small efforts always beat occasional heroic bursts.',
            char1TargetX: -60,
            char2TargetX: 60,
            shot: 'HERO_CLOSEUP',
            duration: 5.8
          },
          {
            env: 'MINIMALIST_STAGE',
            speaker: 0,
            speakerName: 'Rohan',
            text: 'Stay curious, stay consistent, and let time do the heavy lifting.',
            char1TargetX: -40,
            char2TargetX: 40,
            shot: 'MEDIUM_ACTION',
            duration: 5.2
          }
        ]
      }
    };

    this.currentStoryKey = 'TECH_PODCAST';
    this.currentSceneIndex = 0;
    this.activeScriptScenes = [];
    this.sceneTimer = null;

    this.init();
  }

  init() {
    this.bindEvents();

    // Default staging: Dual Mode face-to-face in Podcast Studio
    this.director.setDualMode(true);
    this.director.setEnvironment('PODCAST_STUDIO');

    // Force first render
    this.director.render(0.016);

    // Sync UI with initial character states
    this.syncCharacterInspector();

    // Start continuous animation loop
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  bindEvents() {
    // 1. Navigation Tab Switching (Story / Characters / Worlds)
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        const target = document.getElementById(tabId);
        if (target) target.classList.add('active');
      });
    });

    // 2. Preset Story Chips
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const key = chip.getAttribute('data-story');
        this.selectStoryPreset(key);
      });
    });

    // 3. Main "Create Video" / Generate Button
    const genBtn = document.getElementById('btn-generate-topic-story');
    if (genBtn) {
      genBtn.addEventListener('click', () => {
        const topic = document.getElementById('input-story-topic')?.value?.trim();
        if (!topic) {
          this.showToast('Please enter a conversation or story topic!');
          return;
        }
        this.generateAndPlayStory(topic);
      });
    }

    // 4. Play / Pause Button
    const playBtn = document.getElementById('btn-play-pause');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (this.isPlaying || this.isStorySequencePlaying) {
          this.pause();
        } else {
          const preset = this.storyPresets[this.currentStoryKey];
          if (preset && this.activeScriptScenes.length === 0) {
            this.playMultiSceneStory(preset);
          } else if (this.activeScriptScenes.length > 0) {
            this.isStorySequencePlaying = true;
            this.executeStoryScene(this.currentSceneIndex);
          } else {
            this.playActiveLine();
          }
        }
      });
    }

    // 5. Surprise Me (Randomize Cast)
    const randBtn = document.getElementById('btn-randomize-char');
    if (randBtn) {
      randBtn.addEventListener('click', () => {
        const p1 = this.char1.randomizeNewCharacter();
        const p2 = this.char2.randomizeNewCharacter();
        this.syncCharacterInspector();

        const castElem = document.getElementById('cast-display-name');
        if (castElem) castElem.textContent = `Cast: ${p1.name.split(':')[0]} & ${p2.name.split(':')[0]}`;
        this.showToast(`Generated: ${p1.name.split(':')[0]} & ${p2.name.split(':')[0]}!`);
      });
    }

    // 6. Subtitle Input Box
    const subtitleInput = document.getElementById('input-subtitle-text');
    if (subtitleInput) {
      subtitleInput.addEventListener('input', (e) => {
        const speaker = this.director.activeSpeakerIndex === 1 ? this.char2.profile.name : this.char1.profile.name;
        this.director.setSubtitle(e.target.value, speaker);
      });
    }

    // 7. World Selector Cards
    document.querySelectorAll('.env-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.env-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const envKey = card.getAttribute('data-env');
        this.director.setEnvironment(envKey);
        const worldElem = document.getElementById('world-display-name');
        if (worldElem) worldElem.textContent = `World: ${card.querySelector('.env-card-title')?.textContent || envKey}`;
        this.showToast(`Environment set to: ${card.querySelector('.env-card-title')?.textContent || envKey}`);
      });
    });

    // 8. Character Customizer: Char 1 vs Char 2 toggle
    const btnChar1 = document.getElementById('btn-toggle-char1');
    const btnChar2 = document.getElementById('btn-toggle-char2');
    if (btnChar1 && btnChar2) {
      btnChar1.addEventListener('click', () => {
        btnChar1.classList.add('active');
        btnChar2.classList.remove('active');
        this.activeCharToEdit = 1;
        this.syncCharacterInspector();
      });
      btnChar2.addEventListener('click', () => {
        btnChar2.classList.add('active');
        btnChar1.classList.remove('active');
        this.activeCharToEdit = 2;
        this.syncCharacterInspector();
      });
    }

    // 9. Character Customizer Controls
    const getActiveRig = () => (this.activeCharToEdit === 1 ? this.char1 : this.char2);

    const charArchetypeSelect = document.getElementById('char-archetype-select');
    if (charArchetypeSelect) {
      charArchetypeSelect.addEventListener('change', (e) => {
        getActiveRig().setArchetype(e.target.value);
        this.syncCharacterInspector();
        this.showToast(`Loaded archetype: ${getActiveRig().profile.name}`);
      });
    }

    const charNameInput = document.getElementById('char-name-input');
    if (charNameInput) {
      charNameInput.addEventListener('input', (e) => {
        getActiveRig().setName(e.target.value);
      });
    }

    const charOutfitSelect = document.getElementById('char-outfit-select');
    if (charOutfitSelect) {
      charOutfitSelect.addEventListener('change', (e) => {
        getActiveRig().setOutfit(e.target.value);
        this.showToast(`Outfit updated: ${e.target.value}`);
      });
    }

    const charOutfitColorInput = document.getElementById('char-outfit-color');
    if (charOutfitColorInput) {
      charOutfitColorInput.addEventListener('input', (e) => {
        getActiveRig().setOutfit(null, e.target.value, '#ffffff');
      });
    }

    const charHairSelect = document.getElementById('char-hair-select');
    if (charHairSelect) {
      charHairSelect.addEventListener('change', (e) => {
        getActiveRig().setHair(e.target.value);
      });
    }

    const charHairColorInput = document.getElementById('char-hair-color');
    if (charHairColorInput) {
      charHairColorInput.addEventListener('input', (e) => {
        getActiveRig().setHair(null, e.target.value);
      });
    }

    const charSkinSelect = document.getElementById('char-skin-select');
    if (charSkinSelect) {
      charSkinSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const skinMap = {
          FAIR: { base: '#f7d7c4', highlight: '#fff0e5', shadow: '#e0b89f' },
          WHEATISH: { base: '#d4a373', highlight: '#faedcd', shadow: '#996633' },
          HONEY: { base: '#e6a66b', highlight: '#fed7aa', shadow: '#9a5c2d' },
          BRONZE: { base: '#b46e45', highlight: '#d98e64', shadow: '#784325' },
          RICH_BROWN: { base: '#7c533e', highlight: '#a27054', shadow: '#4d2d1f' },
          DEEP_ESPRESSO: { base: '#4a2c1d', highlight: '#70422c', shadow: '#2d180e' }
        };
        const s = skinMap[val] || skinMap.WHEATISH;
        getActiveRig().setSkinTone(s.base, s.highlight, s.shadow);
      });
    }

    const charAccessorySelect = document.getElementById('char-accessory-select');
    if (charAccessorySelect) {
      charAccessorySelect.addEventListener('change', (e) => {
        getActiveRig().setAccessory(e.target.value);
        this.showToast(`Accessory updated: ${e.target.value}`);
      });
    }

    // 10. Microphone Recording
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

    // 11. Custom Audio Upload
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

    // 12. Video Recording & Export
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

  syncCharacterInspector() {
    const rig = this.activeCharToEdit === 1 ? this.char1 : this.char2;
    const p = rig.profile;

    const nameInput = document.getElementById('char-name-input');
    if (nameInput) nameInput.value = p.name || '';

    const archetypeSelect = document.getElementById('char-archetype-select');
    if (archetypeSelect && p.id) archetypeSelect.value = p.id;

    const outfitSelect = document.getElementById('char-outfit-select');
    if (outfitSelect && p.torso?.type) outfitSelect.value = p.torso.type;

    const outfitColor = document.getElementById('char-outfit-color');
    if (outfitColor && p.torso?.main) outfitColor.value = p.torso.main.startsWith('#') ? p.torso.main : '#1e293b';

    const hairSelect = document.getElementById('char-hair-select');
    if (hairSelect && p.hair?.style) hairSelect.value = p.hair.style;

    const hairColor = document.getElementById('char-hair-color');
    if (hairColor && p.hair?.color) hairColor.value = p.hair.color.startsWith('#') ? p.hair.color : '#18181b';

    const accessorySelect = document.getElementById('char-accessory-select');
    if (accessorySelect) accessorySelect.value = p.accessories || 'NONE';
  }

  selectStoryPreset(key) {
    this.currentStoryKey = key;
    const preset = this.storyPresets[key];
    if (!preset) return;

    // Update Banner
    const castElem = document.getElementById('cast-display-name');
    if (castElem) castElem.textContent = `Cast: ${preset.castName}`;
    const worldElem = document.getElementById('world-display-name');
    if (worldElem) worldElem.textContent = `World: ${preset.worldName}`;

    // Update Topic Input
    const topicInput = document.getElementById('input-story-topic');
    if (topicInput) topicInput.value = preset.title;

    // Configure Characters & Environment
    this.char1.setArchetype(preset.char1Archetype);
    this.char2.setArchetype(preset.char2Archetype);
    this.syncCharacterInspector();

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
    const speaker = this.director.activeSpeakerIndex === 1 ? this.char2.profile.name : this.char1.profile.name;
    this.director.setSubtitle(line, speaker);

    this.isPlaying = true;
    const playBtn = document.getElementById('btn-play-pause');
    if (playBtn) playBtn.textContent = '⏸ Pause';

    this.audioStudio.speakText(line, { pitch: 1.0, rate: 1.0, lang: 'en-US' }, () => {
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
    this.syncCharacterInspector();

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
      document.querySelectorAll('.env-card').forEach(c => {
        if (c.getAttribute('data-env') === scene.env) c.classList.add('active');
        else c.classList.remove('active');
      });
    }

    // 2. Camera Shot
    if (scene.shot) {
      this.director.setShotMode(scene.shot);
    }

    // 3. Move characters into position
    if (scene.char1TargetX !== undefined) {
      this.char1.moveTo(scene.char1TargetX, 120);
    }
    if (scene.char2TargetX !== undefined) {
      this.char2.moveTo(scene.char2TargetX, 120);
    }

    // 4. Set Active Speaker & Subtitle
    const speakerIdx = scene.speaker || 0;
    this.director.setActiveSpeaker(speakerIdx, scene.speakerName);
    this.director.setSubtitle(scene.text, scene.speakerName);

    const subInput = document.getElementById('input-subtitle-text');
    if (subInput) subInput.value = scene.text;

    // 5. Speech Synthesis
    const voiceOpts = {
      pitch: speakerIdx === 0 ? 0.95 : 1.15,
      rate: 1.0,
      lang: 'en-US'
    };

    this.audioStudio.speakText(scene.text, voiceOpts, () => {
      if (this.isStorySequencePlaying) {
        this.sceneTimer = setTimeout(() => {
          this.executeStoryScene(index + 1);
        }, 1200);
      }
    });
  }

  /**
   * Smart Natural Story Generator for ANY topic typed by user
   */
  async generateAndPlayStory(topic) {
    const btn = document.getElementById('btn-generate-topic-story');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>⏳</span> <span>Writing Story...</span>';
    }

    this.showToast(`✨ Generating dialogue for "${topic}"...`);
    await new Promise(r => setTimeout(r, 600));

    const tLower = topic.toLowerCase();

    // Smart contextual environment and theme detection
    let env = 'PODCAST_STUDIO';
    let c1 = 'ALEX';
    let c2 = 'MAYA';
    let n1 = 'Alex';
    let n2 = 'Maya';

    if (tLower.includes('coffee') || tLower.includes('cafe') || tLower.includes('food') || tLower.includes('tea') || tLower.includes('morning')) {
      env = 'COFFEE_SHOP';
      c1 = 'SAM';
      c2 = 'PRIYA';
      n1 = 'Sam';
      n2 = 'Priya';
    } else if (tLower.includes('nature') || tLower.includes('park') || tLower.includes('walk') || tLower.includes('sun') || tLower.includes('outdoor')) {
      env = 'SUNNY_PARK';
      c1 = 'ELENA';
      c2 = 'SAM';
      n1 = 'Elena';
      n2 = 'Sam';
    } else if (tLower.includes('career') || tLower.includes('work') || tLower.includes('job') || tLower.includes('office') || tLower.includes('meeting')) {
      env = 'MODERN_OFFICE';
      c1 = 'DAVID';
      c2 = 'MAYA';
      n1 = 'David';
      n2 = 'Maya';
    } else if (tLower.includes('tech') || tLower.includes('code') || tLower.includes('ai') || tLower.includes('future') || tLower.includes('cyber')) {
      env = 'PODCAST_STUDIO';
      c1 = 'ALEX';
      c2 = 'MAYA';
      n1 = 'Alex';
      n2 = 'Maya';
    } else if (tLower.includes('city') || tLower.includes('dream') || tLower.includes('sunset') || tLower.includes('travel')) {
      env = 'CITY_SUNSET';
      c1 = 'DAVID';
      c2 = 'ELENA';
      n1 = 'David';
      n2 = 'Elena';
    } else {
      env = 'COZY_LOUNGE';
      c1 = 'ALEX';
      c2 = 'SAM';
      n1 = 'Alex';
      n2 = 'Sam';
    }

    const autoStory = {
      title: topic,
      char1Archetype: c1,
      char2Archetype: c2,
      castName: `${n1} & ${n2}`,
      worldName: env.replace(/_/g, ' '),
      avatar: '🎬',
      scenes: [
        {
          env: env,
          speaker: 0,
          speakerName: n1,
          text: `Have you ever thought deeply about this: ${topic}?`,
          char1TargetX: -75,
          char2TargetX: 75,
          shot: 'WIDE_ESTABLISHING',
          duration: 5.2
        },
        {
          env: env,
          speaker: 1,
          speakerName: n2,
          text: `That is such an interesting perspective. Most people overlook how much it shapes our daily decisions.`,
          char1TargetX: -55,
          char2TargetX: 55,
          shot: 'HERO_CLOSEUP',
          duration: 6.0
        },
        {
          env: env,
          speaker: 0,
          speakerName: n1,
          text: `Exactly! When you look at it clearly, everything connects and makes complete sense.`,
          char1TargetX: -35,
          char2TargetX: 35,
          shot: 'MEDIUM_ACTION',
          duration: 5.2
        }
      ]
    };

    // Update banner
    const castElem = document.getElementById('cast-display-name');
    if (castElem) castElem.textContent = `Cast: ${autoStory.castName}`;
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
      const mimeTypes = ['video/webm;codecs=vp9', 'video/webm', 'video/mp4'];
      let selectedMime = mimeTypes.find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm';

      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: selectedMime });

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: selectedMime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `StoryStudio_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.showToast('✅ Video exported successfully!');
      };

      this.mediaRecorder.start();
      this.isRecordingVideo = true;

      const badge = document.getElementById('recording-badge');
      if (badge) badge.style.display = 'flex';
      const recordBtn = document.getElementById('btn-record-video');
      if (recordBtn) recordBtn.innerHTML = '<span>⏹</span> <span>Stop & Save Video</span>';

      this.showToast('🎥 Recording 9:16 video...');
    } catch (err) {
      console.error(err);
      this.showToast('Recording error. Browser might not support canvas capture.');
    }
  }

  stopVideoRecording() {
    if (this.mediaRecorder && this.isRecordingVideo) {
      this.mediaRecorder.stop();
      this.isRecordingVideo = false;

      const badge = document.getElementById('recording-badge');
      if (badge) badge.style.display = 'none';
      const recordBtn = document.getElementById('btn-record-video');
      if (recordBtn) recordBtn.innerHTML = '<span>⬇</span> <span>Export 9:16 Video</span>';
    }
  }

  renderLoop(now) {
    const dt = Math.min(0.1, (now - this.lastTime) / 1000);
    this.lastTime = now;

    this.director.render(dt);
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  showToast(msg) {
    const toast = document.getElementById('toast-notice');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 2800);
  }
}

// Instantiate App when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.storyStudio = new StoryStudioApp();
});
