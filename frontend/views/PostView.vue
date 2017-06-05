<template>
    <section class="post-view">
        <main class="content" role="main">
            <article>
                <div class="page-content about">
                    <h1>Post now</h1>
                    <small>You can now post to facebook anonymously. 😎</small>

                    <div class="divider"></div>
                    <div class="neko-editor"><textarea type='text' data-role='inputContent' v-on:keyup.enter="addHeight" v-on:keyup="check">😽 Post something awesome here</div>
                    <div class="divider post-button">
                    <button class="neko-post">Post it on Facebook 😸</button>
                    </div>
                </div>
            </article>
        </main>
    </section>
</template>

<script>
import dl from 'downloadjs'
const $ = document.querySelector.bind(document)

export default {
    name: 'post-view',
    data() {
        return {
            form: {
                content: '😽 Post something awesome here',
            },
            canvasSize: {
                width: 1280 * 2,
                height: 720 * 2,
            }
        }
    },
    watch: {
        form: {
            handler() {
                this.draw()
            },
            deep: true,
        }
    },
    mounted() { this.draw() },
    computed: {
        fontSize() {
            return {
                
            }
        }
    },
    methods: {
        draw() {
            const existing = $('#canvas')
            if (existing)
                this.$ref.output.removeChild(existing)
            
            const canvas = document.createElement('canvas')
            canvas.id = 'canvas'
            canvas.width = this.canvasSize.width
            canvas.height = this.canvasSize.height
            
            const context = canvas.getContext('2d')
            // For retina display
            context.scale(2,2)


        }
    }
}

</script>

<style lang="scss">
.neko-editor {
    font-size: 3rem;
}

.post-button {
    display: flex;
    justify-content: center;
}

textarea, textarea:hover, textarea:focus, textarea:active {
    background: transparent;
    border: 0;
    border-style: none;
    border-color: transparent;
    outline: none;
    overflow: auto;
    outline-offset: 0;
    box-shadow: none;
    resize: none;
    color: #39393A;
    height: 100%;
    width: 100%;
}
</style>