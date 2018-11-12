# jquery-kpi-plugin

- Manually install the plugin (it will be added to the npm registry)
- Call the plugin:
	- $(#selector).kpi({ params });
	- for the selector, choose any DOM element with id
	- params are optional: if nothing is passed engagement will be set to false
	- ex. $(#selector).kpi({ engagement: true });

- At the moment the plugin has two modes, which can be adjusted as params passed to the plugin when called
  - engagement: true or false
  	- if engagement is set to false, the popover will appear within 2 seconds of page load; or, if the user tries to leave the page, the modal will be triggered again(whichever happens first)
  	- if the modal triggers, a cookie will be set to true and will prevent further triggering
  	- the cookie is set to expire in three days
  	- cookies are destroyed on qutting the browser
  	- if engagement is set to true, the popover will appear not sooner than approximately 40s or 2/3 of the time required to finish reading the page, whichever is shorter
  	- page word count is assessed on page load using p nodes. Ex. if there are 170 words on page

- Dependencies:
  - Jquery, js-cookie, jquery-modal
