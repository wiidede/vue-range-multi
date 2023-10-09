<script>
export default defineComponent({
  name: 'TheRender',
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
