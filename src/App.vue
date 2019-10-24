<template>
  <div :class="$style.app">
    <PipelineSelector :pipelines="pipelines" @change="change" />
    <div :class="$style.pipelineStates">
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

<style module>
.app {
  display: flex;
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.pipelineStates {
  flex: 1;
  margin: 0 30px;
  height: calc(100vh - 16px - 60px);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
</style>
