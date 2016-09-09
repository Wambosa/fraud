_mass image data generation_

for quickly creating many realistic image files with slight differences
pic_jenny randomly creates people with important documents using document templates and a simple customization script.

**NOT** compatible with windows :( due to node-gd dependency

### mac installation notes
- **manually** install xCode, then
- xcode-select -s /Applications/Xcode.app/Contents/Developer
- sudo port install pkgconfig gd2
- npm install node-gd


### todo
- clean up hacks (preloading)
- linux installation notes
- find a way to batch create (kinda slow)
- take in optional positional data on each documentClass
- allow for additional settings on each document that interact with node-gd
- customize export file format
- better arg handling for specific drop location and other useful args like silent

### notes
- [good structured data](http://www.gutenberg.org/files/3201/files/)
- [node-gd full docs](https://github.com/y-a-v-a/node-gd/blob/master/docs/index.md)