<template>
  <transition>
    <h1>{{ emojis }}</h1>
  </transition>
</template>

<script>
export default {
    name: 'spinner',
    props: ['show'],
    serverCacheKey: props => props.show,

    computed: {
        emojis: () => {

            const possible = "🤖🕶🐹🌎🔥🍞⛹🏼🎼👾🚠🚧🚀💻📡🔮⏰🎉🔐🔉🚘🚨🏈⚽️🍔🎄👥😜🐞🛢🐵🐰🚈💣👸🎟🚼🎑🏅🍙💅🎍⛰🏨"
            
            // emoji function
            const emojiToArray = (emoji) => {
                const split = emoji.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)
                const arr = []
                for (let i = 0; i < split.length; i++)
                    if (char !== '') arr.push(split[i])
                return arr
            }

            // emoji generator
            const emojiGenerator = (lens) => {
                const e = emojiToArray(possible)
                let str = ''
                for (let i = 0; i < lens; ++i)
                    str += e[(Math.floor(Math.random() * e.length))]
                return str
            }

            return emojiGenerator(6)
        }
    }
}

</script>