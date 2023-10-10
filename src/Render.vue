<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Render',
  props: {
    render: {
      type: Function,
      required: true,
    },
  },
  render() {
    return this.render && this.render()
  },
})
</script>
