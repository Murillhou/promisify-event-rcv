# promisify-event-rcv

![](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1000px-Node.js_logo.svg.png)

###Description

This module gives the simple capability of wrapping almost any kind of function inside an event handler for a given Event Emitter and an event name.
Then it returns a promise that resolves when the event has been received, and optionally rejects on a given timeout or when other events have been received.

This is quite a common pattern on my day to day and have been so usefull so I decided to share it.

I also found other similar libraries on npm, be sure to check them out because they may fit better your needs:
 - [Promisify-event](https://www.npmjs.com/package/promisify-event "Promisify-event")
 - [P-event](https://www.npmjs.com/package/p-event "P-event") (this one gave me the idea of adding the rejectionEvents option)
 - [Promisify-events](https://www.npmjs.com/package/promisify-events "Promisify-events")

**Table of Contents**

[TOCM]

[TOC]

###License: MIT
Copyright <2018> <Murillhou>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.