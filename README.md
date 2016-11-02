# Pic Jenny
_mass image generation_

A play on words; the Picture _Jennerator_ is for quickly creating many realistic scanned/photographed documents.
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
- ```node ./index.js 9000 /my/dir/dataGen.js```
    - where **9000** is the number of randomly generated documents you want
    - where **/my/dir/dataGen.js** is the random data generator created by _you_
- reads from data folder and populates blank documents using positional metadata json file `templateMetadata.json`

## future
- verbose CLI arguments such as (--gen --count --debug --silent --out)
- add to readme, the required generator interface (since there are some fields that are mandatory; `first`, `last`, `generate()`)
- work around node-gd limitations (mostly a **wontfix** for this quick light image processing implementation)
- linux installation note
- customize export file format

## notes
- [good structured data](http://www.gutenberg.org/files/3201/files/)
- [node-gd full docs](https://github.com/y-a-v-a/node-gd/blob/master/docs/index.md)