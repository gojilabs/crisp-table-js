class GojiLabs {

  static UUID() {
    function _p8(s) {
      var p = (Math.random().toString(16)+'000000000').substr(2,8)
      return s ? '-' + p.substr(0,4) + '-' + p.substr(4,4) : p 
    }
    return _p8() + _p8(true) + _p8(true) + _p8()
  }

  static optionSorter(options, key, reverse) {
    if (!options || options.length === 0) {
      return []
    }
    return options.sort(function(a, b) {
      key = key || 'label'
      var va = String(a[key]).toLowerCase()
      var vb = String(b[key]).toLowerCase()
      if (va < vb) {
        return reverse ? -1 : 1
      } else if (va > vb) {
        return reverse ? 1 : -1
      } else {
        return 0
      }
    })
  }

  static dateFormatter(date) {
    if (!date) {
      date = new Date()
    } else if (typeof date == 'string') {
      date = new Date(date)
    }
    var dd = date.getDate()
    var mm = date.getMonth() + 1   // January is 0!
    var yyyy = date.getFullYear()

    if(dd < 10) {
      dd = '0' + dd
    }

    if(mm < 10) {
      mm = '0' + mm
    }

    return dd + '-' + mm + '-' + yyyy
  }

  static espacenetUrl(docdb_number, kind, date) {
    if (docdb_number && kind && date && kind != 'D0' && kind != 'A0' && kind != 'MPP') {
      return 'http://worldwide.espacenet.com/publicationDetails/biblio?DB=worldwide.espacenet.com&II=0&ND=3&adjacent=true&locale=en_EP&FT=D' +
        '&date=' + date.replace(/-/g, '') +
        '&CC='   + docdb_number.substr(0, 2) +
        '&NR='   + docdb_number.substr(2) + kind +
        '&KC='   + kind
    }
  }
}

export default GojiLabs
