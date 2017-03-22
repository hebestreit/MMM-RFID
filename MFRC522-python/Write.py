#!/usr/bin/env python
# -*- coding: utf8 -*-
import re
import signal

import RPi.GPIO as GPIO
from cStringIO import StringIO

import sys

import MFRC522

continue_reading = True

# Capture SIGINT for cleanup when the script is aborted
def end_read(signal, frame):
    global continue_reading
    print "Ctrl+C captured, ending read."
    continue_reading = False
    GPIO.cleanup()

string = ""
while not string:
    string = raw_input("Value to write: ")
    if len(string) > 16:
        print "Please enter value lower than or equals to 16 characters."
        string = ""

data = [0] * 16
# convert ascii chars to decimal values
for index, char in enumerate(string):
    data[index] = ord(char)

# Hook the SIGINT
signal.signal(signal.SIGINT, end_read)

# Create an object of the class MFRC522
MIFAREReader = MFRC522.MFRC522()

# This loop keeps checking for chips. If one is near it will get the UID and authenticate
while continue_reading:
    # Scan for cards
    (status, TagType) = MIFAREReader.MFRC522_Request(MIFAREReader.PICC_REQIDL)

    # If a card is found
    if status == MIFAREReader.MI_OK:
        print "Card detected"

    # Get the UID of the card
    (status, uid) = MIFAREReader.MFRC522_Anticoll()

    # If we have the UID, continue
    if status == MIFAREReader.MI_OK:

        # Print UID
        print "Card read UID: " + str(uid[0]) + "," + str(uid[1]) + "," + str(uid[2]) + "," + str(uid[3])

        # This is the default key for authentication
        key = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]

        # Select the scanned tag
        MIFAREReader.MFRC522_SelectTag(uid)

        # Authenticate
        status = MIFAREReader.MFRC522_Auth(MIFAREReader.PICC_AUTHENT1A, 8, key, uid)
        print "\n"

        # Check if authenticated
        if status == MIFAREReader.MI_OK:

            # Write the data
            MIFAREReader.MFRC522_Write(8, data)
            print "\n"

            old_stdout = sys.stdout
            sys.stdout = my_stdout = StringIO()

            # Check to see if it was written
            MIFAREReader.MFRC522_Read(8)

            sys.stdout = old_stdout
            block = my_stdout.getvalue()

            print "It now looks like this:"
            match = re.search("^Sector 8 \[(.*)\]$", block)
            if match:
                data = match.group(1).split(', ')
                string = ""
                for dec in data:
                    string += chr(int(dec))
                print string
            print block
            print "\n"

            # Stop
            MIFAREReader.MFRC522_StopCrypto1()

            # Make sure to stop reading for cards
            continue_reading = False
        else:
            print "Authentication error"
