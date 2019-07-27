<template>
  <div>
    <h3>{{ name }}</h3>
    <span v-for="[name, status] in stages" :key="name" >
      <span :class="[$style[status.toLowerCase()], $style['status']]">{{ name }}</span>
    </span>
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
    stages() {
      return Array.from(this.getStageMap(this.state))
    }
  },
  methods: {
    async refresh() {
      const state = await getPipelineState(this.name)
      this.notifyIfChanged(this.state, state)
      this.state = state
    },
    getStageMap(state) {
      if (!state.stageStates) return new Map()
      const m = new Map()
      state.stageStates.forEach(stage => {
        m.set(stage.stageName, stage.latestExecution ? stage.latestExecution.status: 'Pending')
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
