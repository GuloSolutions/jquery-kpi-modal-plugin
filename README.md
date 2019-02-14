# jquery-kpi-plugin

- Manually install the plugin (it will be added to the npm registry)
- Call the plugin:
	-  ``` $(#selector).kpi({ params });```
	- for the selector, choose any DOM element with id
	- params are optional: if nothing is passed, engagement will be set to false
	- ex. ```$(#selector).kpi({ engagement: true });```

- At the moment the plugin has two modes, which can be adjusted as params passed to the plugin when called
  - engagement: true or false
  	- if engagement is set to false, the popover will appear within 2 seconds of page load; or, if the user tries to leave the page, the modal will be triggered again(whichever happens first)
  	- if the modal triggers, a cookie will be set to true and will prevent further triggering
  	- the cookie is set to expire in three days
  	- cookies are destroyed on quitting the browser
  	- if engagement is set to true, the popover will appear not sooner than approximately 40s or 2/3 of the time required to finish reading the page, whichever is shorter
  	- page word count is assessed on page load using p nodes

- List of config params and their defaults:
    -- engagement: false,
    -- pageCounter: 0,
    -- timeToRead: 0,
    -- fadeDuration: 250,
    -- fadeDelay: 0,
    -- pageHits: 3,




- `engagement` is false by default
- `pageCounter` sets counter for events to be triggered while on page
- `timeToRead` sets time to read text on page
- `fadeDuration` sets param for jquery modal
- `fadeDelay` sets param for jquery modal
- `pageHits` sets number of page hits before modal is triggered








- Dependencies:
  - Jquery, js-cookie, jquery-modal
