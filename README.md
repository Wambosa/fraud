# Fabricated Realistic Unique Artificial Documents
_mass image generation_

Despite its name, the intent is not to actually commit fraud itself. The need is for quickly creating many realistic scanned/photographed documents.
FRUAD uses a **data generator** to randomly create _people_ with filled documents using **document templates** and **positional** metadata. Fun Fact: intentionally swapped the _u_ and _a_ in fraud


# Installation
- you **cannot** just call npm install since libgd needs to be built!

## Ubuntu Install
- `sudo apt-get update`
- `sudo apt-get install libgd2-dev`
- `npm install node-gd`

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
- use pool of template images per type
- add links to example output
- add to readme, the required generator interface (since there are some fields that are mandatory; `first`, `last`, `generate()`)
- support asynchronous data generator (for potentially network dependant sources)
- work around node-gd limitations (mostly a **wontfix** for this quick light image processing implementation)
- customize export file format

## notes
- [good structured data](http://www.gutenberg.org/files/3201/files/)
- [node-gd full docs](https://github.com/y-a-v-a/node-gd/blob/master/docs/index.md)