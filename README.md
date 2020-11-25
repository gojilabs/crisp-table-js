# CrispTable JS

CrispTable allows developers to quickly build data-centric, flexible tables. This is the Javascript frontend, a [backend](https://github.com/gojilabs/crisp-table-rb) is also required. For now only a Ruby on Rails backend exists, feel free  CrispTable allows for free-text search, AND searching across multiple columns, column-type searches (e.g. integer and date range searches, string wildcard search) sorting, pagination (with user-configurable page lengths), CSV export, column showing/hiding, and is very fast. It achieves this speed by reducing the amount of Ruby objects necessary when returning large numbers of results, by requiring the developer to do more complex querying in SQL directly, but this is rarely necessary.

## Installation

Add this line to your `package.json` `dependencies`:

```json
"crisp-table": "git+https://www.github.com/gojilabs/crisp-table-js.git"
```

And then execute:

    $ yarn install

After installation, integrate it by:

1. Adding `import CrispTable from 'crisp-table` into your Webpack pipeline
2. Installing a [backend](https://github.com/gojilabs/crisp-table-rb) and following the directions there, only a Ruby on Rails backend exists currently.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/gojilabs/crisp-table-js. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Copyright © [Goji Labs](https://www.gojilabs.com) 2020.
