OnSight-Timer
=============

The OnSight-Timer provides rock climbing competition organizers with a way
to display a countdown timer that gives competitors clear indications as to
the time left in transitions or climbing. It includes all the visual and audio cues
required by the [USAC rule book](http://usaclimbing.net/rockcomps/resources/2014-1010%20USA%20Climbing%20Rule%20Book.pdf). 

Users enter a transition time (optional) and a climbing time. These phases are repeated
until the organizers stop the timer. Audio and visual cues notify climbers of the
following:

- Beginning of transition (if used)
- Beginning of climbing
- One minute remaining in climb time
- Ten seconds remaining in climb time
- End-of-time

Download and Installation
-------------------------

Download the latest release [here](https://github.com/malcolmalex/onsight-timer/releases/latest), and follow the installation instructions. 

If you run into security dialogs on the Mac, see [Mac security instructions](doc/mac-security/mac-security.md).

Getting Started
---------------

The main application screen is shown below:

![Main Window](https://github.com/malcolmalex/onsight-timer/raw/master/doc/OnSight-Timer-main-window.png)

Click the **menu** in the top left corner, and set the transition time and climbing time. Clicking in a field allows you to set the time as MM:SS (minutes:secones).  

![Settings](https://github.com/malcolmalex/onsight-timer/raw/master/doc/OnSight-Timer-Settings.png)

When ready to start, click the **play** button in the bottom right corner, and the transition/climb cycle you've set up will repeat. _Note that clicking play at any point will **restart** the timer!_

Click the **stop** button at the bottom right when you want to end the timing. There is no pause and restart from where you left off.

> To use just a climbing phase, enter 00:00 for the transition time.

Systems Supported
-----------------

The OnSight Timer can be used on Mac OS X and Windows.

License
-------

Copyright 2014 by Malcolm Alexander. OnSight Timer is released under the MIT license.

Contributing
------------

OnSight-Timer is open source and welcome's contributions. See [Contributing](doc/development/contributing.md) for more info.

Acknowledgements
----------------

Thanks to Connie Lightner for documenting the rules, and to Kevin and Marcey Rader-Rhodenbaugh for making the audio recordings.
