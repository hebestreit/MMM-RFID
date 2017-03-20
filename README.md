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
                daniel: [ // data on nfc tag as decimal block will be used as identifier [100, 97, 110, 105, 100, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
| `events`                   | With this property you can define multiple events / notifications which will be dispatched to other module. For this the data block on nfc tag will be used when has been successfully scanned. <br><br> **Possible values:** `array` <br> **Default value:** `[]`

## Usage with other modules

### [MMM-ProfileSwitcher](https://github.com/tosti007/MMM-ProfileSwitcher) by Brian Janssen

Basically I've developed this module to switch different profiles using nfc tags by authenticated user. This can be easily done with [MMM-ProfileSwitcher](https://github.com/tosti007/MMM-ProfileSwitcher).


## Wiring

Please check this [documentation](http://geraintw.blogspot.de/2014/01/rfid-and-raspberry-pi.html) to wire your reader.

## Writing data

For now writing data to the nfc tag is not implemented so you will need to do it yourself. I'm doing my best to implement it as soon as possible.

On block sector 8 you have to define data as decimal values with a length of 16 which will be converted to ascii later. For example [100, 97, 110, 105, 100, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] will be converted to "daniel".
You can check it online [here](https://www.branah.com/ascii-converter).