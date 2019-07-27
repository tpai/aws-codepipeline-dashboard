<template>
  <div>
    <a :href="pipelineUrl" target="_blank">
      <h3>{{ name }}</h3>
    </a>
    <div v-if="state.stageStates">
      <span v-for="stage in state.stageStates" :key="stage.stageName">
        <span v-if="!stage.inboundTransitionState.enabled" :class="$style.disabled"> ⃠</span>
        <a
          target="_blank"
          :href="stage.actionStates[0].entityUrl"
          :title="getStatusMessage(stage)"
          :class="getStatusClass(stage)">
          {{ stage.stageName }}
        </a>
      </span>
    </div>
  </div>
</template>

<script>
import { getPipelineState } from '../api'
import { pushNotification } from '../utils/notification'
const REFRESH_INTERVAL = 60 * 1000

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
      state: {},
      interval: null
    }
  },
  async created() {
    this.interval = setInterval(this.refresh, REFRESH_INTERVAL)
    await this.refresh()
  },
  computed: {
    pipelineUrl() {
      return `https://ap-southeast-1.console.aws.amazon.com/codesuite/codepipeline/pipelines/${this.name}/view`
    },
    stages() {
      return Array.from(this.getStageMap(this.state))
    }
  },
  methods: {
    getStatusClass(stage) {
      const statusClass = stage.latestExecution ? stage.latestExecution.status.toLowerCase() : ''
      return [
        this.$style[statusClass],
        this.$style.status
      ]
    },
    getStatusMessage(stage) {
      if (!stage.actionStates[0] || !stage.actionStates.latestExecution) return ''
      return stage.actionStates[0].latestExecution.summary
    },
    async refresh() {
      const state = await getPipelineState(this.name)
      this.notifyIfChanged(this.state, state)
      this.state = state
    },
    getStageMap(state) {
      if (!state.stageStates) return new Map()
      const m = new Map()
      state.stageStates.forEach(stage => {
        m.set(stage.stageName, stage.latestExecution && stage.latestExecution.status)
      })
      return m
    },
    notifyIfChanged(oldState, newState) {
      const oldStatuses = this.getStageMap(oldState)
      const newStatuses = this.getStageMap(newState)

      for (const stageName of oldStatuses.keys()) {
        const newStatus = newStatuses.get(stageName)
        if (oldStatuses.get(stageName) !== newStatus) {
          pushNotification(`${this.name} Status Changed:`, {
            renotify: true,
            tag: 'status-change',
            requireInteraction: true,
            body: `${stageName}: ${newStatus}`
          })
        }
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style>
a {
  text-decoration: none;
  color: inherit;
}
</style>
<style module>
.status {
  display: inline-block;
  background-color: #ccc;
  color: white;
  margin: 0 10px 0 0;
  padding: 5px;
  border-radius: 3px;
  font-size: 14px;
}
.disabled {
  color: #ccc;
  font-weight: bold;
  margin-right: 10px;
}
.inprogress {
  background-color: #6daeff;
  position: relative;
}
.inprogress:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    #DB4437,
    #F4B400,
    #0F9D58,
    transparent
  );
  background-size: 100px 100%;
}
.inprogress:after :global {
  animation: 3s linear move-bg infinite;
}
@keyframes :global(move-bg) {
  from { background-position-x: 0px; }
  to { background-position-x: 300px; }
}
.succeeded {
  background-color: #45b145;
}
.failed {
  background-color: #f54138;
}
</style>
