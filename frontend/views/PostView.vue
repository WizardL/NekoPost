<template>
    <section class="post-view">
        <main class="content" role="main">
            <article>
                <div class="page-content about">
                    <h1>Post now</h1>
                    <small>You can now post to facebook anonymously. 😎</small>

                    <div class="divider"></div>
                    <div class="neko-editor"><autosize-textarea value="😽 Post something awesome here"></autosize-textarea></div>
                    <div class="divider post-button">
                    <button class="neko-post">Post it on Facebook 😸</button>
                    </div>
                </div>
            </article>
        </main>
    </section>
</template>

<script>
import autosizeTextArea from '../components/Autoresize-textarea.vue'

const $ = document.querySelector.bind(document)

export default {
    name: 'post-view',
    components: {
        'autosize-textarea': autosizeTextArea,
    },
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

            // background
            context.fillStyle = 'black'
            context.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height)

            const addText = (text, y, ratio) => {
                context.textBaseline = 'top'
                context.textAlign = 'left'

                const squashWidth = context.measureText(text).width * ratio
                const split = text.split('\n')

                if (split.length > 1)
                    context.textBaseline = 'middle'
                else
                    context.textBaseline = 'top'
                
                split.map((line, idx) => {
                    const width = context.measureText('M').width
                    context.fillText(line, 40, y + idx * width, squashWidth)
                })
            }

            context.textBaseline = 'top'
            // Content here
            context.font = `700 ${this.fontSize.content}px Helvatica Neue, sans-serif`
            addText(this.form.content, 420, 0.75)
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