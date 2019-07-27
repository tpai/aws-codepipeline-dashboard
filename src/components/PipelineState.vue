<template>
  <div>
    <h3>{{ state.pipelineName }}</h3>
    <span v-for="stage in state.stageStates" :key="stage.stageName" >
      <span :class="[$style[stage.latestExecution.status.toLowerCase()], $style['status']]">{{ stage.stageName }}</span>
    </span>
  </div>
</template>

<script>
import { getPipelineState } from '../api'

export default {
  name: 'PipelineState',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      state: {}
    }
  },
  async created() {
    this.state = await getPipelineState(this.name)
  }
}
</script>

<style module>
.status {
  background-color: #ccc;
  color: white;
  margin: 0 10px 0 0;
  padding: 5px;
  border-radius: 3px;
  font-size: 14px;
}
.succeeded {
  background-color: #45b145;
}
.failed {
  background-color: #f54138;
}
</style>
