import PanelUnderConstruction from './PanelUnderConstruction/PanelUnderConstruction.vue'
import PanelIframe from './PanelIframe/PanelIframe.vue'

let app = {
  props: ['tab', 'config', 'localConfig', 'utils', 'routingID'],
  data () {    
    this.$i18n.locale = this.localConfig.locale
    return {
      searchButtons: []
    }
  },
  components: {
    PanelUnderConstruction,
    PanelIframe
  },
  watch: {
    'localConfig.locale'() {
      this.$i18n.locale = this.localConfig.locale;
    },
    searchButtons (search) {
      // console.log(search)
      if (!this.localConfig.searchButtons[this.routingID]) {
        this.localConfig.searchButtons[this.routingID] = {}
      }

      this.localConfig.searchButtons[this.routingID][this.title] = search

      // console.log(this.localConfig.searchButtons)
      this.$parent.$parent.saveToLocalStorage()
    }
  },
  computed: {
    title () {
      return this.tab.title
    },
    // tab () {
    //   return this.$parent.tab
    // },
    urlList () {
      let urlList = this.tab.url
      if (Array.isArray(urlList) === false) {
        urlList = [urlList]
      }
      return urlList
    },
    tabTypes () {
      let splitor = '_'
      if (this.tab.type.indexOf(',') > -1) {
        splitor = ','
      }
      return this.tab.type.split(splitor)
    },
  },
  mounted() {
    this.loadSearchKeywords()
  },
  methods: {
    loadSearchKeywords () {
      let searchButtons = this.localConfig.searchButtons[this.routingID]
      // console.log(searchButtons)
      if (!searchButtons) {
        return []
      }

      let search = searchButtons[this.title]
      // console.log(search)
      if (!search) {
        return []
      }

      this.searchButtons = this.searchButtons.concat(search)
    },
    parsePos (pos) {
      let y = 0
      if (['1', '2', '3', '4'].indexOf(pos) > -1) {
        y = 0
      }
      else if (['q', 'w', 'e', 'r'].indexOf(pos) > -1) {
        y = 1
      }
      else if (['a', 's', 'd', 'f'].indexOf(pos) > -1) {
        y = 2
      }
      else if (['z', 'x', 'c', 'v'].indexOf(pos) > -1) {
        y = 3
      }

      let x = 0
      if (['1', 'q', 'a', 'z'].indexOf(pos) > -1) {
        x = 0
      }
      else if (['2', 'w', 's', 'x'].indexOf(pos) > -1) {
        x = 1
      }
      else if (['3', 'e', 'd', 'c'].indexOf(pos) > -1) {
        x = 2
      }
      else if (['4', 'r', 'f', 'v'].indexOf(pos) > -1) {
        x = 3
      }

      return {
        x, y
      }
    },
    parseRow (type) {
      return this.parsePos(type[0]).y
    },
    parseCol (type) {
      return this.parsePos(type[0]).x
    },
    parseWidth (type) {
      return (1 + this.parsePos(type[1]).x - this.parsePos(type[0]).x)
    },
    parseHeight (type) {
      // console.log(type, this.parsePos(type[1]), this.parsePos(type[0]))
      return (1 + this.parsePos(type[1]).y - this.parsePos(type[0]).y)
    },
    clearSearch (i) {
      let current = this.searchButtons
      current[i] = ''
      this.searchButtons = this.searchButtons.splice(0,0).concat(current[i])
    },
    filterButtons (buttons, search) {
      // let output = []

      let titles = Object.keys(buttons)
      
      if (search && search.trim() !== '') {
        titles = titles.filter(t => {
          let parts = search.split(' ')

          for (let i = 0; i < parts.length; i++) {
            if (t.indexOf(parts[i]) !== -1) {
              return true
            }
          }
          return false
        })

        if (titles.length === 0) {
          titles = Object.keys(buttons)
        }
      }

      return titles.map(t => {
        return {
          title: t,
          url: buttons[t]
        }
      })
    },
    filterSearchButton (url, search) {
      if (!search || search.trim() === '') {
        return url
      }

      let output = []

      url.forEach(row => {
        let outputRow = []
        row.forEach((button) => {
          if (button[0].indexOf(search) === -1) {
            return false
          }

          outputRow.push(button)
        })

        if (outputRow.length > 0) {
          output.push(outputRow)
        }
      })

      return output
    }
  }
}

export default app