<template>
    <textarea>{{ value }}</textarea>
</template>

<script>
import autosize from 'autosize'

export default {
    name: 'autoresize-textarea',
    props: ['handle-change', 'value'],
    mounted() { autosize(this.$el) }
}

</script>