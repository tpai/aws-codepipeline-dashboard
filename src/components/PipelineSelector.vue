<template>
  <form @change="change" ref="form" :class="$style.form">
    <div v-for="pipeline in pipelines" :key="pipeline.name">
      <input
        type="checkbox"
        name="pipelines[]"
        :checked="pipeline.isSelected"
        :value="pipeline.name"
        :id="pipeline.name">
      <label :for="pipeline.name">
        {{ pipeline.name }}
      </label>
    </div>
  </form>
</template>

<script>
export default {
  name: 'PipelineSelector',
  props: {
    pipelines: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    change() {
      const selected = Array.from(this.$refs.form.querySelectorAll('[name^=pipelines]:checked')).map(x => x.value)
      localStorage.setItem('selectedPipelineNames', JSON.stringify(selected))
      this.$emit('change', selected)
    }
  }
}
</script>

<style module>
.form {
  position: fixed;
  left: 0;
  top: 0;
  padding: 10px;
  height: calc(100vh - 20px);
  overflow-y: scroll;
  background: white;
}
</style>
