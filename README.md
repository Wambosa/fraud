# Pic Jenny
_mass image generation_

A play on words Picture _Jennerator_ is for quickly creating many realistic scanned/photographed documents.
Pic Jenny currently randomly creates _people_ with filled documents using document templates and positional metadata.

## OSX install
- **don't** just do npm-install
- **manually** install xCode, then
- ```xcode-select -s /Applications/Xcode.app/Contents/Developer```
- ```sudo port install pkgconfig gd2```
- ```npm install node-gd```

## Windows Install
**NOT** compatible with windows :( due to node-gd dependency

## usage
```node ./index.js 9000```

## future
- separate the current use case into its own project (from the pure recursive create logic + metadata json read + cache)
- linux installation note
- customize export file format
- better arg handling for specific drop location and other useful args like silent

## notes
- [good structured data](http://www.gutenberg.org/files/3201/files/)
- [node-gd full docs](https://github.com/y-a-v-a/node-gd/blob/master/docs/index.md)