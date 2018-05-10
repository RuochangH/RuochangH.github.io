# Final Project Proposal


## Problem / Question

This application is designed to help user find bike stations
while rebalancing the system from user end. In 2015, the City of Philadelphia launched Indego bike share system.
As a new mode that facilitates short distance travels and transit rides, the system is popular
across the town. However, the unbalanced bike flows hamper the operation and expansion of the system.
On the one hand, it results in full or empty station frequently, downgrading the reliability of the
system. On the other hand, bike reallocation, the current solution to this problem, is based on real-time activity,
which is costy and lagging behind. Basically, this application aims at matching user needs and station availabilities
to avoid the case when users aren't able to use the system(no dock or no bike) after they arrived the station.
Besides, this application provides choice of nearby station in need of rebalancing so that users can decide to
choose to return or rent bike in that station to help sustaining the system. Station in need of rebalancing are
defined as stations that are projected to have large number of bike departures or arrivals in the next hour based on
historical data.

## The data

- Divvy station status live Data
- Divvy 2016-1017 historical data. This historical data was downloaded from Divvy and processed in R and carto to
summarize two years' average hourly net bike changes.

## Technologies used

jQuery: get data; read user input, change html content;
mapbox: layer style
mapbox gl: routing, geolocatorControl;
underscore: process and filter data
turf: generating routes
d3: create charts for historical data report;
bootstrap: layout

## Design spec

#### User experience

At a high level, how do you expect people to use your application?
- Who are the users: Indego bike users
- What do they gain from your application' use: up to date station availability and
historical information, choice of nearest available stations and rebalancing stations
based on user purpose, routes to destination stations. Basically, if you are returning
your bike you will know where is the nearest station that has at least one dock and
where is the nearest station that is projected to have a large number of bike departure
in the next hour and how to get to these two stations.

#### Layouts and visual design

This application has a introduction page with live data to create enphasize the concern of
unbalanced bike flow and importance of bike rebalancing. The second page is where user can
actually use the application as tool to faciliate their bike travel.


## Anticipated difficulties

mapbox layout, working with both live and historical data

## Missing pieces

Because of data constraints, the projection of bike rebalancing needs was based on
only historical data. By adding other socio-economic variables, the application will be more 
reliable.
