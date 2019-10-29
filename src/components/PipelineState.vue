<template>
  <div :class="[$style.container, {[$style['container-summary']]: !noSummary}]">
    <a :href="pipelineUrl" target="_blank" :class="$style.title">
      {{ name }}
    </a>
    <div v-if="state.stageStates" :class="$style.stages">
      <span v-for="stage in state.stageStates" :key="stage.stageName" :class="$style.stageContainer">
        <span v-if="!stage.inboundTransitionState.enabled" :class="$style.disabled">{{ '\u20E0' }}</span>
        <div :class="$style.stage">
          <a
            target="_blank"
            :href="stage.actionStates[0].entityUrl"
            :title="getStatusMessage(stage)"
            :class="[$style.status, getStatusClass(stage)]">
            {{ stage.stageName }}
          </a>
          <div :class="$style.time">
            {{ formatTime(stage.latestAction.latestExecution.lastStatusChange) }}
          </div>
        </div>
      </span>
    </div>
    <pre v-if="!noSummary" :class="$style.summary">{{ summary }}</pre>
  </div>
</template>

<script>
import { getPipelineState } from '../api'
import { pushNotification } from '../utils/notification'
import { formatTimeAgo } from '../utils/time'
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
      const region = process.env.VUE_APP_AWS_REGION
      return `https://${region}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${this.name}/view`
    },
    stages() {
      return Array.from(this.getStageMap(this.state))
    },
    noSummary() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('nosummary');
    },
    summary() {
      if (this.noSummary) {
        return ''
      }
      return this.getStatusMessage(this.state.stageStates[0])
    }
  },
  methods: {
    formatTime(str) {
      return formatTimeAgo(new Date(str))
    },
    getStatusClass(stage) {
      const statusClass = stage.latestExecution ? stage.latestExecution.status.toLowerCase() : ''
      return this.$style[statusClass]
    },
    getStatusMessage(stage) {
      if (!stage.actionStates[0] || !stage.actionStates[0].latestExecution) return ''
      return stage.actionStates[0].latestExecution.summary
    },
    async refresh() {
      const { data: state } = await getPipelineState(this.name)
      this.notifyIfChanged(this.state, state)
      this.state = this.processState(state)
    },
    processState(state) {
      state.stageStates.forEach(stage => {
        stage.latestAction = this.getLatestAction(stage.actionStates)
      })
      return state
    },
    getLatestAction(actionStates = []) {
      return actionStates.sort((a1, a2) => {
        const { latestExecution: { lastStatusChange: t1 } } = a1
        const { latestExecution: { lastStatusChange: t2 } } = a2
        return new Date(t2).valueOf() - new Date(t1).valueOf()
      })[0]
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
.container {
  border: 1px solid transparent;
  border-radius: 3px;
  padding: 0 10px;
}

.container-summary {
  margin: 10px;
  width: calc(100% - 42px);
}

.title {
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
}
.stages {
  display: flex;
  flex-flow: row nowrap;
}
.status {
  display: inline-block;
  background-color: #ccc;
  color: white;
  margin: 0 10px 0 0;
  padding: 5px;
  border-radius: 3px;
  font-size: 14px;
  min-width: 70px;
  text-align: center;
}
.stageContainer {
  display: flex;
}
.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.time {
  margin: 0 10px 0 0;
  font-size: 10px;
  text-align: right;
  color: #888;
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
.summary {
  white-space: normal;
  max-width: 400px;
}
</style>
