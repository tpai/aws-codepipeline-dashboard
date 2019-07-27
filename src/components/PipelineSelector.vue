<template>
  <form @change="change" ref="form">
    <div v-for="pipeline in pipelines" :key="pipeline.name">
      <input
        type="checkbox"
        name="pipelines[]"
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
      this.$emit('change', selected)
    }
  }
}
</script>

<style module>
</style>
