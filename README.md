# MMM-RFID

This is a module for [MagicMirror²](https://magicmirror.builders/) to interact with other modules by RFID-RC522 via python and GPIO.

[MFRC522-python](https://github.com/mxgxw/MFRC522-python) is used for python part and wrapped in JavaScript.

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/hebestreit/MMM-RFID.git
````

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
    {
        module: 'MMM-RFID',
        config: {
            events: {
                daniel: [ // data on rfid tag as decimal block will be used as identifier [100, 97, 110, 105, 100, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    {
                        CURRENT_PROFILE: "daniel" // i.e. "CURRENT_PROFILE" is used for notification identifier and "daniel" for notification payload
                    }
                ]
            }
        }
    }
]
````

## Configuration options

The following properties can be configured:

| Option                     | Description
| -------------------------- | -----------
| `events`                   | With this property you can define multiple events / notifications which will be dispatched to other module. For this the data block on rfid tag will be used when has been successfully scanned. <br><br> **Possible values:** `array` <br> **Default value:** `[]`

## Usage with other modules

### [MMM-ProfileSwitcher](https://github.com/tosti007/MMM-ProfileSwitcher) by Brian Janssen

Basically I've developed this module to switch different profiles using rfid tags by authenticated user. This can be easily done with [MMM-ProfileSwitcher](https://github.com/tosti007/MMM-ProfileSwitcher).


## Wiring

Please check this [documentation](http://geraintw.blogspot.de/2014/01/rfid-and-raspberry-pi.html) to wire your reader.

## Writing data

To write data to tag please run following code as sudo and enter your value. On block sector 8 it's saved as decimal values with a length of 16 which will be converted to ascii later. For example [100, 97, 110, 105, 100, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] will be converted to "daniel".
You can check it online [here](https://www.branah.com/ascii-converter).

Please let me know if you've got a smarter idea!

**Careful** Stop MagicMirror if MMM-RFID module is running before writing or reading tag via python! 

````
sudo python modules/MMM-RFID/MFRC522-python/Write.py
````

## Reading data

After you've write successfully your data to rfid tag you can run following command to check it's value.

````
sudo python modules/MMM-RFID/MFRC522-python/Read.py
````