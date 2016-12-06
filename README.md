# Fabricated, Realistic, and Unique Documents
_mass image generation_

Despite its name, the intent is not to actually commit fraud itself. The need is for quickly creating many realistic scanned/photographed documents.
FRaUD uses a **data generator** to randomly create _people_ with filled documents using **document templates** and **positional** metadata.


# Installation
- you **cannot** just call npm install since libgd needs to be built first!

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

# Resulting Images & Output
- ![](http://shondiaz.com/host/Jakie_Hermina_AutoContract.jpg)
- ![](http://shondiaz.com/host/Jakie_Hermina_DriversLicense.jpg)
- ![](http://shondiaz.com/host/Jakie_Hermina_SsnCard.jpg)
- metadata json

```
{
 "name": "Jakie_Hermina_SsnCard",
 "class": "SsnCard",
 "rotation": "up",
 "fields": [
  {
   "name": "ssn",
   "bounds": [
    174,
    120,
    277,
    136
   ]
  },
  {
   "name": "fullName",
   "bounds": [
    162,
    213,
    237,
    228
   ]
  }
 ]
}
```

# How it works
The FRaUD program requires a **data source** to correspond with **template metadata**.

### data source
- An example data source is: **./example/exampleGenerator.js**.
- the data source must have a _synchronous_ method named **generate**. _(planning on supporting async soon)_
- At a minimum, ```generate()``` _must_ return the **required fields**: **first** and **last**.
- **ssn** and **fullName** are custom fields that correspond with the **template metadata**; eventually becoming actualized on a fabricated document instance. 
- **handwriting** is optional, and can provide some customization to simulated signatures that differs from the default font of a document instance.
 - within handwriting:
 - **angle** _optional_: will make the text appear tilted. Beware that this is a very sensitive number.
 - **font** _optional_: is a future string path to a font
 - **size** _optional_: is a percentage used to multiply by the default baseline fontsize.
 - **color** _optional_: is a 0-255 rgb color value object
 
```
module.exports = {
    generate: function(){
        return {
            first: "james",
            last: "bond",
            
            ssn: "123-45-6789",
            fullName: "james bond",
            
            handwriting: {
                angle: randomInt(-4, 4) * .025,
                font: 'future todo',
                size: randomInt(3, 12) * .1,
                color: {r: randomInt(0,255), g: randomInt(0,255), b: randomInt(0,255)}
            }
        }
    }
}
```

### template metadata
- An example **template metadata** is: **./data/templateMetadata.json**  
 - **class** _required_: is a name used to refer to the type of document. It is completely cosmetic to this program. It is used in the file output name.
 - **file** _required_: is ideally some image of a document with empty fields located in the ```./data``` directory.
 - **fontSize** _optional_: is a default baseline font size before any handwriting is applied to a document instance.
 - **fields** _optional_: is an array of ```{name: "myFieldName", x: 0, y: 0}``` 
  - where the value of **name** corresponds to output from the aforementioned **data source**. 
  - **x & y** are pixel coordinates (starting from top-left).
 - all of these documents _must_ be placed in a json file located and named **./data/templateMetadata.json**
  - additionally the documents must be inside an array named ```docs: []```
  
```
{
    docs: [
        {
          "class": "SsnCard",
          "file": "ssn_template.jpg",
          "fontSize": 12,
          "fields": [
            {
              "name": "ssn",
              "x": 175, "y": 135
            },
            {
              "name": "fullName",
              "isHandWritten": true,
              "x": 165, "y": 223
            }
          ]
        }
    ]
}
```

# flags
flags can be applied to either documents or individual fields to alter the way it looks

### document
- **color** is a 0-255 rgb color value object ```{r: 255, g: 0, b: 0}``` (prevents default grayscaling of the image on load)
- **rotation** (can be one of string value: "up", "down", "left", "right"; in order to enforce a particular direction every time. default is random)

### field
- **isHandwritten** (utilizes the _optional_ handwriting provided by the **data source**)


# future
- verbose CLI arguments such as 
 - --gen (the location to the random data generator)
 - --templates (the location of the templateMetadata)
 - --count (the approximate number of documents you wish to generate) 
 - --debug (for debuggy stuff. more console logging)
 - --silent (no console.logging) 
 - --out (the directory to place newly created docs)
 - --no-meta (do not create the .json files associated with each document)
- use pool of template images per type
- honor handwriting font
- set document font or pool of fonts
- add links to example output
- support asynchronous data generator (for potentially network dependant sources)
- support more than just openJPEG
- customize export file format
- maybe allow generator to supply images for certain fields

## notes
- [good structured data](http://www.gutenberg.org/files/3201/files/)
- [node-gd full docs](https://github.com/y-a-v-a/node-gd/blob/master/docs/index.md)