<template lang="pug">
    v-container(fluid row justify-center align-center)
        v-flex(xl8 lg8 md8 sm10 xs12 align-center)
            v-card.rbp-layout-responsive__content
                v-card-title(v-if="!!heading")
                    h3 {{heading}}
                v-card-text
                    slot
</template>
<style lang="stylus" scoped>
    .rbp-layout-responsive__content {
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    }
</style>
<script>

    export default {
        props: ['heading']
    }

</script>