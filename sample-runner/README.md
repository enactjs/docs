This is a stand-alone sample runner that is intended to be embedded within an iframe.
It listens for messages passed to the iframe containing the code to be executed.

It is meant to be built and placed into the `static` directory within the docs.

TODO: Need method to auto-generate `EnactImporter` from the source files.

TODO: Set up a method to allow the frame to grow/shrink with the contents of the iframe.

TODO: Timing dependency before it can receive messages. Perhaps add handler into html or use another
way to have initial code set.

TODO: Prevent error from taking down the sample entirely. (Right now, it just will reset back when
the error boundary is triggered.  Not perfect at all)

TODO: Add scripts for enact version selection here?  Or, in docs?
