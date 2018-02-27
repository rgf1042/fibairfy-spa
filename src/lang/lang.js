import Vue from 'vue'
import VueI18n from 'vue-i18n'
import store from '../store/store'

Vue.use(VueI18n)

const messages = {
  ca: require('./locale/ca.json'),
  en: require('./locale/en.json')
}

const i18n = new VueI18n({
  locale: store.state.user.locale,
  messages
})

export default i18n
