Prepare your environment
------------------------

1. Install nodejs to get npm, node package manager.

Build
-----

1. Clone the repository.
2. Run npm install to install the development dependencies.
3. This project uses GulpJS for builds ...
  * Run `gulp` to do the basic build
  * Run `gulp run-build` for development testing. Command-R on mac will refresh the application without having to restart.
  * Run `gulp run-dist` to produce and run from an asar archive, which is the way the main application code is distributed at releases.

Contributing
------------
This project uses the basic fork/pull model, and follows some basic rules:

- A distributable can be built from the master branch at any time.
- To work on something, create a descriptively named branch off of master
- Commit to that locally, and regular push to the same-named branch on the server
- When ready, or when you need feedback or review, submit a pull request
- After it has been reviewed and signed-off, it will be merged into master
