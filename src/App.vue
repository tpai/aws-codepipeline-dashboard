<template>
  <div :class="$style.app">
    <PipelineSelector :pipelines="pipelines" @change="change" />
    <div :class="[$style.pipelineStates, {[$style['pipelineStates-summary']]: !noSummary}]">
      <PipelineState
        v-for="name in selectedPipelineNames"
        :key="name"
        :name="name" />
    </div>
  </div>
</template>

<script>
import PipelineSelector from './components/PipelineSelector.vue'
import PipelineState from './components/PipelineState.vue'
import { getPipelines } from './api'
import { requestPermission } from './utils/notification'

export default {
  name: 'app',
  components: {
    PipelineSelector,
    PipelineState,
  },
  data() {
    return {
      pipelines: [],
      selectedPipelineNames: []
    }
  },
  mounted() {
    requestPermission()
    this.initPipelines()
  },
  computed: {
    noSummary() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('nosummary');
    }
  },
  methods: {
    async initPipelines() {
      const res = localStorage.getItem('selectedPipelineNames')
      this.selectedPipelineNames = JSON.parse(res || '[]')
      const selectedSet = this.selectedPipelineNames.reduce((set, name) => {
        return set.add(name)
      }, new Set())
      const { data: { pipelines } } = await getPipelines()

      this.pipelines = pipelines.map(p => {
        return {
          ...p,
          isSelected: selectedSet.has(p.name)
        }
      })
    },
    change(selectedPipelineNames) {
      this.selectedPipelineNames = selectedPipelineNames
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>
<style module>
.app {
  display: flex;
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.pipelineStates {
  flex: 1;
  display: flex;
  margin: 0 340px;
  height: 100vh;
  flex-flow: column wrap;
}

.pipelineStates-summary {
  flex-flow: column nowrap;
}
</style>
