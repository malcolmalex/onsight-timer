Application Design
------------------

OnSight Timer is meant to satisfy a couple of requirements:
- cross-platform desktop application (one codebase for mac and windows)
- Built using web technologies (javascript and related libraries)
- relatively easy to maintain and evolve (simple addition of new announcements)

The diagram below shows the basic timing process as implemented for the 2014-15
rulebook. Each horizontal dashed line represents a "stream" of events, one
second apart. Two main streams, the transition stream and the climbing stream
are combined, and other streams created from these to represent the appropriate
events that the UI needs to reflect, or that needs to trigger audio tracks.

![Timing Cycle](https://github.com/malcolmalex/onsight-timer/raw/master/doc/OnSight-Timer-Stream-Diagram.png)

The cycles above repeat until stopped via the "stop" button or the
application is shut down.

See the code comments for further detail.

Cross-platform Desktop Application
==================================

OnSight Timer is built on top of @atom/atom-shell, which is basically a combination of
Chromium and NodeJS. Applications are written in HTML, CSS, Javascript, but run
as a desktop application, with most of the benefits of greater access to local
resources.

Web Technologies
================

This application leverages Polymer core and paper elements, or web components.
Polymer is a set of polyfils and technologies that implement a number of the
newer web standards, such as HTML templates, web components, html imports,
templates, and the shadow dom.

Additionally, the timing nature of the application lends itself to the use of
event streams, and RxJS is used to provide a simpler mechanism to work with
and maintain various cycles of events and the responses to those events.

Ease of Maintenance and Update
==============================

This application has no loops, using event streams to abstract the timing
cycles. See the code for comments on the use of RxJS Observables for event
management.
