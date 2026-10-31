/**
 * VISUAL STORY GENERATOR - MANO LAB
 * story-engine.js - Script Generation, Story Templates, & Scene Directors
 * 
 * Analyzes topics and generates full multi-scene scripts formatted specifically
 * for viral 9:16 vertical shorts (YouTube Shorts, Instagram Reels, TikTok),
 * including visual prompts, camera motions, VFX presets, and bilingual narrations.
 */

class StoryEngine {
  constructor() {
    // Built-in curated viral templates
    this.PRESET_STORIES = {
      'sheshnag-vasuki': {
        id: 'sheshnag-vasuki',
        title: 'Sheshnag & Vasuki: The Serpent Brothers',
        hindiTitle: 'शेषनाग और वासुकि: एक माँ के दो बेटे',
        genre: 'mythology',
        theme: 'mythic-gold',
        hook: 'एक ही माँ के दो बेटे... एक बने भगवान विष्णु की शय्या, और दूसरे बने महादेव शिव के गले का हार!',
        scenes: [
          {
            id: 1,
            title: 'The Divine Brothers',
            narrationHindi: 'एक ही माँ के दो बेटे... एक बने भगवान विष्णु की शय्या, और दूसरे बने महादेव शिव के गले का हार!',
            narrationEnglish: 'Two sons of one mother... One became the cosmic couch of Lord Vishnu, the other the sacred necklace of Mahadev Shiva!',
            visualDesc: 'Two majestic colossal serpents coiling amidst swirling celestial cosmic clouds and golden light.',
            artPrompt: 'Cinematic hyper-realistic 8k Indian mythology, two giant celestial serpentine deities coiling in cosmic clouds, one glowing with gold divine light, other with deep blue mystical aura, dramatic rim lighting, unreal engine 5 render',
            cameraMotion: 'ZOOM_IN',
            vfx: 'DIVINE_RAYS',
            bgStyle: 'cosmic_clouds',
            duration: 6
          },
          {
            id: 2,
            title: 'The Great Penance',
            narrationHindi: 'जब माँ कद्रू ने छल करने को कहा, तो बड़े भाई शेषनाग ने अधर्म का साथ देने से मना कर दिया और कठोर तपस्या में लीन हो गए।',
            narrationEnglish: 'When mother Kadru demanded deceit, elder brother Sheshnag renounced the serpent court and plunged into supreme Himalayan penance.',
            visualDesc: 'Colossal golden multi-headed serpent in deep meditation surrounded by ice Himalayas and celestial fires.',
            artPrompt: 'Giant multi-headed golden serpent meditating on snow-covered Himalayan peaks, divine penance fire, mystical ancient Sanskrit aura, cinematic volumetric fog, wide angle epic composition',
            cameraMotion: 'PAN_UP',
            vfx: 'SNOW_EMBERS',
            bgStyle: 'mountain_fire',
            duration: 6.5
          },
          {
            id: 3,
            title: 'The Foundation of Earth',
            narrationHindi: 'उनकी तपस्या से प्रसन्न होकर ब्रह्मा जी ने उन्हें संपूर्ण पृथ्वी का भार अपने फनों पर धारण करने का वरदान दिया।',
            narrationEnglish: 'Pleased by his purity, Lord Brahma bestowed upon Sheshnag the eternal duty to support the entire Earth on his thousand cosmic hoods.',
            visualDesc: 'Thousand-headed radiant serpent holding planet Earth in space beneath the serene feet of Lord Vishnu in Vaikuntha.',
            artPrompt: 'Thousand-headed radiant serpent king Adishesha holding the cosmos, glowing scales, resting beneath Lord Vishnu in celestial ocean of milk, divine tranquility, masterpiece digital art',
            cameraMotion: 'ZOOM_OUT',
            vfx: 'DIVINE_RAYS',
            bgStyle: 'ocean_of_milk',
            duration: 6.5
          },
          {
            id: 4,
            title: 'Vasuki & Samudra Manthan',
            narrationHindi: 'वहीं छोटे भाई वासुकि ने समुद्र मंथन में मंदराचल पर्वत की रस्सी बनकर अमृत पाने के लिए असहनीय विष और पीड़ा सही।',
            narrationEnglish: 'Meanwhile, younger brother Vasuki became the churning rope in Samudra Manthan, enduring scorching friction and cosmic venom for the universe.',
            visualDesc: 'Mighty serpent Vasuki coiled around Mount Mandara in violently churning ocean of milk, glowing with fiery friction.',
            artPrompt: 'Epic Samudra Manthan churning of the milk ocean, giant serpent Vasuki coiled around rotating mountain, cosmic waves, glowing blue and emerald poison, hyper-dramatic lighting',
            cameraMotion: 'SHAKE_PULSE',
            vfx: 'OCEAN_EMBERS',
            bgStyle: 'churning_ocean',
            duration: 7
          },
          {
            id: 5,
            title: 'Mahadev’s Eternal Grace',
            narrationHindi: 'उनकी इस भक्ति और त्याग को देखकर महादेव शिव ने उन्हें सदैव के लिए अपने गले का श्रृंगार बना लिया।',
            narrationEnglish: 'Moved by Vasuki’s boundless sacrifice and devotion, Lord Shiva adorned him forever around His sacred throat as His divine protector.',
            visualDesc: 'Close-up of Lord Shiva in tranquil cosmic meditation with the radiant emerald serpent Vasuki resting gracefully around His blue throat.',
            artPrompt: 'Lord Shiva Neelkanth portrait, peaceful closed eyes, third eye subtle glow, holy serpent Vasuki coiled around his blue neck with glowing eyes, trident in background, sacred ash vibhuti, cinematic 8k masterpiece',
            cameraMotion: 'ZOOM_IN',
            vfx: 'DIVINE_RAYS',
            bgStyle: 'shiva_aura',
            duration: 6.5
          },
          {
            id: 6,
            title: 'The Eternal Truth',
            narrationHindi: 'जन्म एक जैसा हो सकता है, लेकिन आपके कर्म और निष्ठा ही तय करते हैं कि आप किस भगवान के प्रिय बनेंगे। हर हर महादेव!',
            narrationEnglish: 'Birth may be identical, but it is your righteous action and selfless devotion that crowns your destiny. Har Har Mahadev!',
            visualDesc: 'Split screen cosmic convergence of Lord Vishnu reclining on Sheshnag and Lord Shiva adorned with Vasuki in golden light.',
            artPrompt: 'Grand spiritual convergence, Lord Vishnu on golden Sheshnag and Lord Shiva with Vasuki, golden divine aura, cosmic transcendence, cinematic typography frame',
            cameraMotion: 'PAN_LEFT',
            vfx: 'CELESTIAL_SPARKS',
            bgStyle: 'cosmic_temple',
            duration: 6
          }
        ]
      },

      'karna-destiny': {
        id: 'karna-destiny',
        title: 'Karna: The Unconquerable Tragic Hero',
        hindiTitle: 'कर्ण: सूर्यपुत्र की अमर गाथा',
        genre: 'mythology',
        theme: 'mythic-gold',
        hook: 'सूर्य का पुत्र... पर सूतपुत्र कहलाया! जिसके दान के आगे इंद्र का सिंहासन भी डोल उठा!',
        scenes: [
          {
            id: 1,
            title: 'Son of the Sun',
            narrationHindi: 'सूर्य का पुत्र, कवच और कुंडल के साथ जन्मा, फिर भी दुनिया ने उसे सूतपुत्र कहकर दुत्कारा!',
            narrationEnglish: 'Born of the Sun God with impenetrable golden armor, yet the world mocked him as a mere charioteer’s foster son!',
            visualDesc: 'Baby Karna in a floating basket adorned with shining celestial golden armor on the flowing sacred river Ganga.',
            artPrompt: 'Infant warrior with glowing golden chest armor floating in basket on sacred Ganges river at sunrise, golden sun rays, hyper-detailed epic Indian art',
            cameraMotion: 'ZOOM_IN',
            vfx: 'DIVINE_RAYS',
            bgStyle: 'sunrise_river',
            duration: 6
          },
          {
            id: 2,
            title: 'The Vow of Friendship',
            narrationHindi: 'जब सारी सभा ने उसे अपमानित किया, तो दुर्योधन ने उसे अंगराज का मुकुट पहनाया। कर्ण ने अपनी मित्रता पर प्राण न्योछावर कर दिए।',
            narrationEnglish: 'When the royal assembly disgraced him, Duryodhana crowned him King of Anga. Karna vowed his very life to that sacred bond.',
            visualDesc: 'Karna receiving the royal crown, hand over heart, eyes burning with unyielding loyalty in the grand Hastinapur arena.',
            artPrompt: 'Ancient Indian royal arena, heroic warrior Karna being crowned, blazing eyes of honor, ornate golden crown, dramatic crowd in background, cinematic warm lighting',
            cameraMotion: 'PAN_UP',
            vfx: 'GOLDEN_DUST',
            bgStyle: 'royal_arena',
            duration: 6.5
          },
          {
            id: 3,
            title: 'The Supreme Charity (Daanveer)',
            narrationHindi: 'स्वयं देवराज इंद्र ब्राह्मण बनकर आए, और कर्ण ने जानते हुए भी अपने सीने से काटकर दिव्य कवच और कुंडल दान कर दिए!',
            narrationEnglish: 'Even when Indra disguised as a sage came begging, Karna sliced off his skin-bound armor and gave it away with a fearless smile!',
            visualDesc: 'Karna carving his golden earrings and armor, offering them to the sage with tears of pride, bleeding divine light.',
            artPrompt: 'Daanveer Karna giving away his golden earrings and armor, bleeding golden light, supreme sacrifice, thunderstorm sky, god Indra in sage robes, high contrast painting',
            cameraMotion: 'SHAKE_PULSE',
            vfx: 'DIVINE_RAYS',
            bgStyle: 'thunder_sky',
            duration: 7
          },
          {
            id: 4,
            title: 'The Fallen Chariot',
            narrationHindi: 'कुरुक्षेत्र के रण में पहिया धरती में धंस गया, विद्या विस्मृत हो गई, पर मृत्यु भी उसके सामने झुक कर आई।',
            narrationEnglish: 'On Kurukshetra’s battlefield, curses struck all at once: his wheel sank, his mantras vanished, yet even Death bowed before his valor.',
            visualDesc: 'Karna lifting his massive chariot wheel from the blood-soaked battlefield with one hand, arrows raining down from crimson skies.',
            artPrompt: 'Epic Kurukshetra war battlefield, warrior Karna trying to lift chariot wheel stuck in mud, sunset blood red sky, arrows flying, smoke and embers, cinematic 8k',
            cameraMotion: 'ZOOM_OUT',
            vfx: 'WAR_EMBERS',
            bgStyle: 'war_sunset',
            duration: 6.5
          },
          {
            id: 5,
            title: 'Immortal Daanveer',
            narrationHindi: 'इतिहास ने पांडवों को विजय दी, लेकिन हर दिल ने दानवीर कर्ण को अमर बना दिया!',
            narrationEnglish: 'History recorded the Pandavas’ victory, but humanity’s heart crowned Karna as the immortal King of Honor!',
            visualDesc: 'Celestial silhouette of Karna ascending into the blazing Sun God Surya, glowing with eternal golden aura.',
            artPrompt: 'Spiritual warrior silhouette ascending into massive radiant sun, golden particles, divine triumph of character over victory, masterpiece digital painting',
            cameraMotion: 'ZOOM_IN',
            vfx: 'GOLDEN_DUST',
            bgStyle: 'sun_ascension',
            duration: 6
          }
        ]
      },

      'black-hole-mystery': {
        id: 'black-hole-mystery',
        title: 'What Actually Happens Inside a Black Hole?',
        hindiTitle: 'ब्लैक होल के अंदर का रहस्य',
        genre: 'scifi',
        theme: 'dark-cosmic',
        hook: 'अगर आप ब्लैक होल के अंदर गिर जाएं... तो क्या आप मरेंगे या किसी दूसरे ब्रह्मांड में जागेंगे?',
        scenes: [
          {
            id: 1,
            title: 'The Event Horizon',
            narrationHindi: 'इवेंट होराइज़न... अंतरिक्ष का वह बिंदु जिसके आगे प्रकाश भी कभी वापस नहीं लौट सकता!',
            narrationEnglish: 'The Event Horizon... the cosmic boundary where gravity becomes so absolute that even light can never escape!',
            visualDesc: 'Massive glowing accretion disk spinning around an absolute black sphere bending spacetime in deep space.',
            artPrompt: 'Hyper-realistic glowing golden orange accretion disk around supermassive black hole, gravitational lensing, interstellar space, deep stars, 8k cinematic wallpaper',
            cameraMotion: 'ZOOM_IN',
            vfx: 'COSMIC_NEBULA',
            bgStyle: 'black_hole_disk',
            duration: 6
          },
          {
            id: 2,
            title: 'Time Dilation & Spaghettification',
            narrationHindi: 'जैसे ही आप पास जाएंगे, आपके पैरों पर खिंचाव सिर से लाखों गुना ज्यादा होगा — इसे वैज्ञानिक स्पैगेटिफिकेशन कहते हैं!',
            narrationEnglish: 'As you cross, gravitational tidal forces stretch your atoms into an infinitely thin ribbon of matter: Spaghettification!',
            visualDesc: 'Astronaut figure stretching into shimmering quantum light particles as time dilates into a frozen visual echo.',
            artPrompt: 'Surreal visual of astronaut disintegrating into quantum light threads entering black hole singularity, distortion of time and space, neon cyan and deep violet',
            cameraMotion: 'PAN_UP',
            vfx: 'QUANTUM_GLITCH',
            bgStyle: 'space_distortion',
            duration: 6.5
          },
          {
            id: 3,
            title: 'The Holographic Universe',
            narrationHindi: 'लेकिन आइंस्टीन के सिद्धांतों के अनुसार, अंदर समय और स्थान आपस में बदल जाते हैं — आप आगे नहीं, भविष्य की ओर गिरते हैं!',
            narrationEnglish: 'According to General Relativity, space and time invert inside: moving forward in space becomes moving forward toward inevitable time!',
            visualDesc: 'Crystalline geometric tesseract corridor folding infinitely into the center of the singularity.',
            artPrompt: 'Inside of black hole singularity, folding higher dimensions, glowing geometric hypercube, infinite corridors of past and future, Christopher Nolan Interstellar style',
            cameraMotion: 'SHAKE_PULSE',
            vfx: 'DIVINE_RAYS',
            bgStyle: 'tesseract_void',
            duration: 7
          },
          {
            id: 4,
            title: 'The White Hole Portal',
            narrationHindi: 'कुछ भौतिकविदों का मानना है कि ब्लैक होल का दूसरा सिरा एक "व्हाइट होल" है — जहाँ से नया ब्रह्मांड फूटता है!',
            narrationEnglish: 'Cutting-edge theoretical physicists theorize the exit is a White Hole — the primordial seed of a completely new Big Bang universe!',
            visualDesc: 'Blinding white cosmic fountain spewing new galaxies and matter into an uncharted dimensional void.',
            artPrompt: 'White hole explosion erupting into pristine white and gold galaxies, birth of a baby universe, cosmic genesis, blinding brilliance, breathtaking render',
            cameraMotion: 'ZOOM_OUT',
            vfx: 'CELESTIAL_SPARKS',
            bgStyle: 'white_hole_birth',
            duration: 6.5
          }
        ]
      }
    };
  }

  /**
   * Generates a viral 5-scene Short script from any custom topic entered by user
   */
  generateScriptFromTopic(topicText, genre = 'mythology', language = 'hindi') {
    const cleanTopic = topicText.trim() || 'The Legend of Ancient Gods';
    
    // Check if preset matches topic
    const lower = cleanTopic.toLowerCase();
    if (lower.includes('shesh') || lower.includes('vasuki') || lower.includes('snake') || lower.includes('serpent')) {
      return this.PRESET_STORIES['sheshnag-vasuki'];
    }
    if (lower.includes('karna') || lower.includes('surya') || lower.includes('mahabharat')) {
      return this.PRESET_STORIES['karna-destiny'];
    }
    if (lower.includes('black hole') || lower.includes('space') || lower.includes('cosmic') || lower.includes('singularity')) {
      return this.PRESET_STORIES['black-hole-mystery'];
    }

    // Procedural Story Architect
    const storyId = `story-${Date.now().toString(36)}`;
    const capitalizedTopic = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);

    const generatedScenes = [
      {
        id: 1,
        title: 'The Viral Hook',
        narrationHindi: `क्या आप जानते हैं ${cleanTopic} के पीछे का वह रहस्य, जिसे इतिहास ने दुनिया से छिपाकर रखा?`,
        narrationEnglish: `Did you know the untold secret behind ${cleanTopic} that history tried to bury from the world?`,
        visualDesc: `Dramatic cinematic reveal of ${cleanTopic} with dark atmospheric lighting and intense volumetric shadows.`,
        artPrompt: `Cinematic dramatic 8k concept art of ${cleanTopic}, dark atmosphere, mysterious fog, golden rim lighting, highly detailed unreal engine 5`,
        cameraMotion: 'ZOOM_IN',
        vfx: 'DIVINE_RAYS',
        bgStyle: 'cosmic_clouds',
        duration: 5.5
      },
      {
        id: 2,
        title: 'The Origin Conflict',
        narrationHindi: `शुरुआत में किसी ने नहीं सोचा था कि यह घटना पूरे युग की दिशा हमेशा के लिए बदल देगी।`,
        narrationEnglish: `At the genesis of this tale, no one anticipated that a single choice would alter the course of an entire era forever.`,
        visualDesc: `Ancient sacred ruins or temple grounds under a tempestuous sky with swirling winds and embers.`,
        artPrompt: `Ancient monumental architecture under dramatic stormy skies, embers floating, cinematic wide shot, mysterious ancient aura, 8k wallpaper`,
        cameraMotion: 'PAN_UP',
        vfx: 'SNOW_EMBERS',
        bgStyle: 'mountain_fire',
        duration: 6
      },
      {
        id: 3,
        title: 'The Turning Point',
        narrationHindi: `जब संकट चरम पर पहुंचा, तो एक ऐसी शक्ति का प्रादुर्भाव हुआ जिसने असंभव को संभव बना दिया।`,
        narrationEnglish: `When darkness reached its zenith, an extraordinary force emerged, turning the impossible into absolute reality.`,
        visualDesc: `Epic surge of power, radiating divine energy and dynamic shockwaves across the terrain.`,
        artPrompt: `Explosion of radiant divine power and energy shockwaves, cosmic battle impact, hyper-detailed fantasy render, vivid colors`,
        cameraMotion: 'SHAKE_PULSE',
        vfx: 'OCEAN_EMBERS',
        bgStyle: 'churning_ocean',
        duration: 6.5
      },
      {
        id: 4,
        title: 'The Great Climax',
        narrationHindi: `इस त्याग और बलिदान ने सिद्ध कर दिया कि साहस और सत्य के आगे कोई भी बाधा टिक नहीं सकती।`,
        narrationEnglish: `This supreme devotion and fearless resolve proved that no obstacle can withstand the force of righteous conviction.`,
        visualDesc: `Heroic victory pose or transcendental illumination bathing the surroundings in majestic light.`,
        artPrompt: `Majestic monumental climax, heroic figure bathed in celestial illumination, divine blessing, triumphant cinematic framing, masterwork`,
        cameraMotion: 'ZOOM_OUT',
        vfx: 'DIVINE_RAYS',
        bgStyle: 'shiva_aura',
        duration: 6.5
      },
      {
        id: 5,
        title: 'The Final Punchline',
        narrationHindi: `समय बदलता है, युग बीत जाते हैं, लेकिन अमर वही रहते हैं जिनके कर्म महान होते हैं! आपका क्या मानना है? कमेंट में बताएं!`,
        narrationEnglish: `Eras fade, empires crumble, but legends sculpted by noble deeds endure for eternity! What is your thought? Share below!`,
        visualDesc: `Golden emblem or transcendental sunset leaving a lasting philosophical impression on the viewer.`,
        artPrompt: `Glorious golden sunset over sacred mountain peaks, celestial particles, profound peace and eternity, cinematic typography frame`,
        cameraMotion: 'PAN_LEFT',
        vfx: 'CELESTIAL_SPARKS',
        bgStyle: 'cosmic_temple',
        duration: 6
      }
    ];

    return {
      id: storyId,
      title: capitalizedTopic,
      hindiTitle: `${capitalizedTopic}: अनदेखी गाथा`,
      genre: genre,
      theme: 'mythic-gold',
      hook: `क्या आप जानते हैं ${cleanTopic} के पीछे का वह रहस्य?`,
      scenes: generatedScenes
    };
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.StoryEngine = StoryEngine;
}
