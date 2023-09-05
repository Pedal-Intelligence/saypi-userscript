
Expected event sequence:
[Log] dispatching event: saypi:piReadyToRespond (talk, line 7)
[Log] dispatching event: saypi:awaitingUserInput (talk, line 388)
[Log] dispatching event: saypi:piSpeaking (talk, line 7)
[Log] dispatching event: audio:setupRecording (talk, line 388)
[Log] dispatching event: audio:tearDownRecording (talk, line 388)
[Log] dispatching event: saypi:piStoppedSpeaking (talk, line 7)
[Log] dispatching event: saypi:piFinishedSpeaking (talk, line 7)

Unexpected event sequence:
[Log] dispatching event: saypi:piReadyToRespond (talk, line 7)
[Log] dispatching event: saypi:awaitingUserInput (talk, line 388)
[Log] dispatching event: saypi:piStoppedSpeaking (talk, line 7) -- out of order?
[Log] dispatching event: saypi:receivedUserInput (talk, line 7)
[Log] dispatching event: audio:loading (talk, line 7)
[Log] dispatching event: saypi:receivedUserInput (talk, line 388) -- duplicate?
[Log] dispatching event: saypi:piReadyToRespond (talk, line 7) -- why is this here?
[Log] dispatching event: saypi:awaitingUserInput (talk, line 388) -- why is this here?
[Log] dispatching event: saypi:piSpeaking (talk, line 7)
[Log] dispatching event: saypi:piStoppedSpeaking (talk, line 7)
[Log] dispatching event: saypi:piFinishedSpeaking (talk, line 7)

Unexpected event sequence #2:
[Log] dispatching event: saypi:piReadyToRespond (talk, line 7)
[Log] dispatching event: saypi:awaitingUserInput (talk, line 388)
[Log] dispatching event: saypi:piStoppedSpeaking (talk, line 7) -- out of order, expected before awaitingUserInput
[Log] dispatching event: saypi:receivedUserInput (talk, line 7)
[Log] dispatching event: audio:loading (talk, line 7)
[Log] dispatching event: saypi:receivedUserInput (talk, line 388) -- duplicate, user only clicked once
[Log] dispatching event: saypi:piReadyToRespond (talk, line 7) -- why?
[Log] dispatching event: saypi:awaitingUserInput (talk, line 388) -- why? user already responded
[Log] dispatching event: saypi:piSpeaking (talk, line 7)
[Log] dispatching event: saypi:piStoppedSpeaking (talk, line 7)
[Log] dispatching event: saypi:piFinishedSpeaking (talk, line 7)