<template>
  <AppLayout active-id="">
    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="font-display text-[22px] font-bold text-white leading-tight">Developer Documentation</h1>
        <p class="text-g3 text-sm mt-1">Everything you need to integrate the Sanas SDK into your application.</p>
      </div>
      <a
        href="https://developer.sanas.ai"
        target="_blank"
        class="inline-flex items-center gap-1.5 text-grn hover:text-grn/80 text-xs font-medium transition-colors"
      >
        Full docs site
        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
    </div>

    <!-- Quick nav cards -->
    <div class="grid grid-cols-2 gap-4 mb-8">
      <a
        href="https://developer.sanas.ai/SDK/Get-Started/Quickstart-Guide"
        target="_blank"
        class="bg-card border border-border1 rounded-r p-5 hover:border-grn/30 hover:bg-card2 transition-all group"
      >
        <div class="flex items-center gap-2 mb-2">
          <div class="w-7 h-7 rounded-rxs bg-grn/10 border border-grn/20 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-grn" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <span class="text-sm font-semibold text-white">Quick Start</span>
          <svg class="w-3 h-3 text-g5 ml-auto group-hover:text-grn transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </div>
        <p class="text-xs text-g4">Process your first audio stream in under 5 minutes.</p>
      </a>
      <a
        href="https://developer.sanas.ai/SDK/Get-Started/API-Reference"
        target="_blank"
        class="bg-card border border-border1 rounded-r p-5 hover:border-grn/30 hover:bg-card2 transition-all group"
      >
        <div class="flex items-center gap-2 mb-2">
          <div class="w-7 h-7 rounded-rxs bg-pur/10 border border-pur/20 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-pur" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <span class="text-sm font-semibold text-white">API Reference</span>
          <svg class="w-3 h-3 text-g5 ml-auto group-hover:text-grn transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </div>
        <p class="text-xs text-g4">Full SDK API reference and parameter documentation.</p>
      </a>
    </div>

    <!-- What is Sanas -->
    <div class="bg-card border border-border1 rounded-r p-6 mb-5">
      <h2 class="text-sm font-semibold text-white mb-3">What is Sanas?</h2>
      <p class="text-sm text-g3 leading-relaxed mb-4">
        Sanas provides AI-powered speech processing for voice agents and real-time communication.
        Our SDK leverages advanced AI models to enhance voice communication quality and improve
        speech recognition accuracy in noisy real-world environments.
      </p>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-card2 border border-border1 rounded-rs p-4">
          <div class="text-xs font-semibold text-white mb-1">AI Voice Agents</div>
          <p class="text-[11px] text-g4 leading-relaxed">Improve ASR accuracy by 5–30% in noisy environments. Full voice isolation or noise cancellation with speech preservation.</p>
        </div>
        <div class="bg-card2 border border-border1 rounded-rs p-4">
          <div class="text-xs font-semibold text-white mb-1">Noise Cancellation</div>
          <p class="text-[11px] text-g4 leading-relaxed">Remove background noise from human conversations. Ideal for contact centers, conferencing, and gaming.</p>
        </div>
      </div>
    </div>

    <!-- Installation -->
    <div class="bg-card border border-border1 rounded-r p-6 mb-5">
      <h2 class="text-sm font-semibold text-white mb-1">Installation</h2>
      <p class="text-xs text-g4 mb-4">Requires Ubuntu 22.04 x86-64 · Python 3.10+ · SDK credentials from your welcome email</p>

      <div class="text-xs font-medium text-g3 mb-2">1. Extract and install</div>
      <div class="relative bg-[#060606] border border-border1 rounded-rs p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <span class="font-mono text-[10px] bg-card2 border border-border1 rounded px-[6px] py-[2px] text-g4">bash</span>
          <button @click="copy('install')" class="bg-transparent text-g3 border border-border2 hover:bg-card2 hover:text-white rounded-rxs px-2 py-1 text-[10px] font-mono transition-colors">
            {{ copied === 'install' ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <pre class="font-mono text-[11.5px] text-g2 leading-[1.8] overflow-x-auto"><code>tar -zxvf sanas_remote_sdk_&lt;platform-arch&gt;_&lt;version&gt;.tar.gz
cd sanas_remote_sdk_&lt;platform-arch&gt;_&lt;version&gt;
./install.sh</code></pre>
      </div>

      <div class="text-xs font-medium text-g3 mb-2">2. Verify installation</div>
      <div class="relative bg-[#060606] border border-border1 rounded-rs p-4">
        <div class="flex items-center justify-between mb-3">
          <span class="font-mono text-[10px] bg-card2 border border-border1 rounded px-[6px] py-[2px] text-g4">bash</span>
          <button @click="copy('verify')" class="bg-transparent text-g3 border border-border2 hover:bg-card2 hover:text-white rounded-rxs px-2 py-1 text-[10px] font-mono transition-colors">
            {{ copied === 'verify' ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <pre class="font-mono text-[11.5px] text-g2 leading-[1.8] overflow-x-auto"><code>source sanas_remote_sdk/bin/activate
python3 -c "import sanas_remote_sdk; print('SDK installed successfully!')"</code></pre>
      </div>
    </div>

    <!-- AI Models -->
    <div class="bg-card border border-border1 rounded-r p-6 mb-5">
      <h2 class="text-sm font-semibold text-white mb-4">AI Model Selection</h2>
      <div class="space-y-2">
        <div class="bg-card2 border border-border1 rounded-rs p-3 flex items-start gap-3">
          <span class="font-mono text-[10px] bg-grn/10 text-grn border border-grn/20 rounded px-2 py-1 shrink-0 mt-0.5">≤16 kHz</span>
          <div>
            <div class="text-xs font-semibold text-white mb-0.5">AGENTIC_VI_G_NC <span class="text-g5 font-normal">— default</span></div>
            <div class="text-[11px] text-g4">Single-speaker isolation. Removes environmental noise. Best for voice agents.</div>
          </div>
        </div>
        <div class="bg-card2 border border-border1 rounded-rs p-3 flex items-start gap-3">
          <span class="font-mono text-[10px] bg-grn/10 text-grn border border-grn/20 rounded px-2 py-1 shrink-0 mt-0.5">≤16 kHz</span>
          <div>
            <div class="text-xs font-semibold text-white mb-0.5">AGENTIC_ST_NC</div>
            <div class="text-[11px] text-g4">Multi-speaker environments. Preserves background speech. Best for contact centers.</div>
          </div>
        </div>
        <div class="bg-card2 border border-border1 rounded-rs p-3 flex items-start gap-3">
          <span class="font-mono text-[10px] bg-blu/10 text-blu border border-blu/20 rounded px-2 py-1 shrink-0 mt-0.5">≤24 kHz</span>
          <div>
            <div class="text-xs font-semibold text-white mb-0.5">VI_G_NC3.0</div>
            <div class="text-[11px] text-g4">General-purpose noise cancellation for human calls.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Code examples -->
    <div class="bg-card border border-border1 rounded-r p-6 mb-5">
      <h2 class="text-sm font-semibold text-white mb-4">Common Use Cases</h2>

      <!-- Use case tabs -->
      <div class="flex gap-1 mb-4 border-b border-border1">
        <button
          v-for="uc in useCases"
          :key="uc.id"
          @click="activeUseCase = uc.id"
          :class="[
            'px-3 py-2 text-xs font-medium border-b-2 transition-colors -mb-px',
            activeUseCase === uc.id ? 'text-white border-grn' : 'text-g4 border-transparent hover:text-g2',
          ]"
        >{{ uc.label }}</button>
      </div>

      <div v-for="uc in useCases" :key="uc.id" v-show="activeUseCase === uc.id">
        <p class="text-xs text-g3 mb-3">{{ uc.description }}</p>
        <div class="relative bg-[#060606] border border-border1 rounded-rs p-4">
          <div class="flex items-center justify-between mb-3">
            <span class="font-mono text-[10px] bg-card2 border border-border1 rounded px-[6px] py-[2px] text-g4">python</span>
            <button @click="copy(uc.id)" class="bg-transparent text-g3 border border-border2 hover:bg-card2 hover:text-white rounded-rxs px-2 py-1 text-[10px] font-mono transition-colors">
              {{ copied === uc.id ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre class="font-mono text-[11.5px] text-g2 leading-[1.8] overflow-x-auto"><code>{{ uc.code }}</code></pre>
        </div>
      </div>
    </div>

    <!-- Support -->
    <div class="bg-card border border-border1 rounded-r p-5 flex items-center justify-between">
      <div>
        <div class="text-sm font-semibold text-white mb-0.5">Need help?</div>
        <div class="text-xs text-g4">Response within 1 business day · Urgent issues via support portal</div>
      </div>
      <div class="flex gap-2">
        <a href="mailto:support@sanas.ai" class="inline-flex items-center gap-1.5 bg-transparent text-g2 border border-border2 hover:bg-card2 hover:text-white rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors">
          support@sanas.ai
        </a>
        <a href="https://support.sanas.ai" target="_blank" class="inline-flex items-center gap-1.5 bg-grn text-black hover:bg-grn/90 rounded-rxs px-3 py-[6px] text-xs font-medium transition-colors">
          Support Portal
        </a>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import AppLayout from '../components/AppLayout.vue'

const copied = ref(null)

function copy(key) {
  const text = codeBlocks[key]
  if (text) navigator.clipboard.writeText(text).catch(() => {})
  copied.value = key
  setTimeout(() => { copied.value = null }, 2000)
}

const activeUseCase = ref('voice-agent')

const useCases = [
  {
    id: 'voice-agent',
    label: 'Voice Agent ASR',
    description: 'Improve ASR accuracy by 5–30% in noisy environments using full voice isolation.',
    code: `from sanas_sdk import create_sdk

sdk = create_sdk(
    endpoint="...",
    account_id="...",
    secret="..."
)
processor = sdk.create_processor(model="AGENTIC_VI_G_NC")

clean_audio = processor.process(noisy_audio)`,
  },
  {
    id: 'noise-cancel',
    label: 'Noise Cancellation',
    description: 'Remove background noise from contact center calls using voice isolation.',
    code: `from sanas_sdk import create_sdk

sdk = create_sdk(
    endpoint="...",
    account_id="...",
    secret="..."
)
processor = sdk.create_processor(model="VI-G", confidence=1.0)

clean_audio = processor.process(noisy_call_audio)`,
  },
  {
    id: 'multi-speaker',
    label: 'Multi-Speaker',
    description: 'Handle environments with multiple speakers while preserving background speech.',
    code: `from sanas_sdk import create_sdk

sdk = create_sdk(
    endpoint="...",
    account_id="...",
    secret="..."
)
processor = sdk.create_processor(model="AGENTIC_ST_NC")

clean_audio = processor.process(multi_speaker_audio)`,
  },
]

const codeBlocks = {
  install: `tar -zxvf sanas_remote_sdk_<platform-arch>_<version>.tar.gz\ncd sanas_remote_sdk_<platform-arch>_<version>\n./install.sh`,
  verify:  `source sanas_remote_sdk/bin/activate\npython3 -c "import sanas_remote_sdk; print('SDK installed successfully!')"`,
  'voice-agent': useCases[0].code,
  'noise-cancel': useCases[1].code,
  'multi-speaker': useCases[2].code,
}
</script>
