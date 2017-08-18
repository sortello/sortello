[![CircleCI](https://circleci.com/gh/mazzcris/sortello.svg?style=shield)](https://circleci.com/gh/mazzcris/sortello)
# Sortello
A javascript application to sort/prioritize Trello cards

Hosted version: https://sortello.ideato.it/

## Usage

To run sortello on your machine:

`npm install`

`npm start`

Sortello will be available at localhost:4000

## Contributing

1. Fork the project!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Running Protractor end-to-end tests

`./node_modules/protractor/bin/protractor protractor.conf.js --params.username=<username> --params.password=<password> --params.extId=<cardId>`

username: the username for your Trello test account

password: the password for your Trello test account

cardId: the ID of any card from the test list

*Please note: For the tests to work, at the moment, the titles of the cards in the list must be integers from 1 to 10.*

<!--
## History

TODO: Write history

## Credits

TODO: Write credits

## License

TODO: Write license
-->
