;( function( $, window, document, undefined ) {
    "use strict";
        // Create the defaults once
        var pluginName = "kpi",
            defaults = {
                engagement: false,
                mouseLeave: false,
                pageCounter: 0,
                timeToRead: 0,
                timeToTrigger: 0,
                fadeDuration: 250,
                fadeDelay: 0,
                pageHits: 0,
                timeToRead: 0,
                subscribed: false,
                regex: ''
            };

        function Plugin ( element, options ) {
            this.element = element;
            this.settings = $.extend( {}, defaults, options );
            this._defaults = defaults;
            this._name = pluginName;
            this.init();
        }

        if (sessionStorage.getItem("popped") === undefined) {
            var m_trigger = 0;
            sessionStorage.setItem("popped", m_trigger);
        } else {
            var m_trigger = sessionStorage.getItem("popped");
        }

        if (mCounter === undefined){
            var mCounter = 0;
        }

        if (timeToReadCounter === undefined){
            var timeToReadCounter = 0;
        }

        if (sessionStorage.getItem("pages") === 'undefined') {
            var pageHitsCurrent = 0;
        }

        if (sessionStorage.getItem("newsletter") === 'undefined') {
            sessionStorage.setItem("newsletter", 1);
        }

        $.extend( Plugin.prototype, {
            init: function() {

                if (this.detectUrlRegex()){
                    return;
                }

                this.modalCounter();
                this.counter();
                this.subscribed();
                this.countPageHits();

                this.isMouseLeave();
                if (this.settings.engagement === true){
                    this.checkWordCount();
                 }
        },
            timeOut: function()
            {
                var id = this.element.id;

                if (this.settings.engagement === false){
                    window.setTimeout(function(){
                        $('#'+id).modal({
                            fadeDuration: this.settings.fadeDuration,
                            fadeDelay: this.settings.fadeDelay
                        });
                    }, 2000);
                }
                m_trigger++;
                sessionStorage.setItem("popped", m_trigger);
            },

            isMouseLeave: function()
            {
                var id = this.element.id;
                var trigger = sessionStorage.getItem("popped");

                if (this.settings.mouseLeave === false ){
                    return;
                }

                $('body').mouseleave(function(){
                    var activated = $('#coupon-cards');
                    if (this.settings.engagement === false && trigger <= 2 && mCounter <= 3) {
                        if ( activated.length && activated.css('display') ==  'none') {
                            $('#'+id).modal({
                                fadeDuration: this.settings.fadeDuration,
                                fadeDelay: this.settings.fadeDelay
                            });
                            this.setCookies('modalpopupcookie');
                            this.setCookies('modalpageopened');

                            m_trigger++;
                            sessionStorage.setItem("popped", m_trigger);
                        }
                    }
                });
            },
            counter: function ()
            {
                var id = this.element.id;
                var isCookieSet = this.settings.isCookieSet;
                var timeToRead = this.settings.timeToRead;

                if (timeToRead <= 0){
                    return;
                }

                var runCounter = function(){
                    if (timeToReadCounter == timeToRead) {
                        clearInterval(this);
                    }
                    else {
                        timeToReadCounter++;
                        console.log("Time to read counter " + timeToReadCounter);
                        checkConditions();
                    }
                };
                // engagement is true
                var checkConditions = function () {
                    if (timeToReadCounter >= 7 && isCookieSet !== true){
                        $('#'+id).modal({
                            fadeDuration: fadeDuration,
                            fadeDelay: fadeDelay,
                        });
                    }
                    else if(timeToReadCounter*7 < Math.trunc(timeToRead*(2/3)) ){
                        ('#'+id).modal({
                            fadeDuration: fadeDuration,
                            fadeDelay: fadeDelay,

                        });
                    }
                };
                setInterval(runCounter, 6000);
                runCounter();
            },

            modalCounter: function(){
                var pageCounter = this.settings.pageCounter;
                if (pageCounter <= 0 ){
                       return;
                }

                var runModalCounter = function(){
                    if (mCounter == pageCounter) {
                        return;
                    } else {
                        mCounter++;
                        console.log(mCounter);
                    }
                };

                setInterval(runModalCounter, 1000);
                runModalCounter();
            },

            // get word count using p nodes
            checkWordCount: function()
            {
                var timeToRead = this.settings.timeToRead;
                var wordsPerMinute = 250;
                var nodes = document.querySelectorAll('p'),i;
                var gross = "";
                var wordCount = null;
                if(nodes.length > 0){
                    for (i = 0; i < nodes.length; i++) {
                        gross += nodes[i].innerText;
                    }
                    wordCount = gross.replace(/(<([^>]+)>)/ig,"").split(' ').length;
                    timeToRead = Math.ceil(wordCount / wordsPerMinute)*60;
                }
            },
            countPageHits: function(){
                var pageHits = this.settings.pageHits;
                var pageHitsCurrent = sessionStorage.getItem("pages");
                var id = this.element.id;

                if (pageHits == 0 || pageHitsCurrent > pageHits ) {
                    return;
                }

                if (pageHits == pageHitsCurrent && Cookies.get('newsletter') === undefined ){
                      $('#'+id).modal({
                         fadeDuration: this.settings.fadeDuration,
                         fadeDelay:  this.settings.fadeDelay,
                    });
                }

                $(window).on('unload', function() {
                    pageHitsCurrent++;
                    sessionStorage.setItem("pages", pageHitsCurrent);
                });
            },
            subscribed: function() {
                 $('input[type="submit"]').on('click', function() {
                    if ($(this).val().toLowerCase() == 'subscribe'){
                        sessionStorage.setItem("newsletter",  1);
                        this.setCookies('newsletter', 365);
                    }
                });
            },
            setCookies:  function(cookie, expiresIn) {

                if (!expiresIn) {
                    expiresIn = 3;
                }

                if (Cookies.get(cookie) === undefined) {
                    var cval = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    Cookies.set(cookie, cval, { expires: expiresIn, path: '/' });
                }
            },
            detectUrlRegex: function () {
                if (undefined === this.settings.regex || !this.settings.regex.length){
                    return;
                }
                var re = new RegExp(this.settings.regex);
                var sstring = window.location.pathname;
                var clean = sstring.replace(/\//g, '');

                if (clean.match(re) !== null){
                    return true;
                }

                return false;
            },
        });

        $.fn[ pluginName ] = function( options ) {
            return this.each( function() {
                if ( !$.data( this, "plugin_" + pluginName ) ) {
                    $.data( this, "plugin_" +
                       pluginName, new Plugin( this, options ) );
                }
            } );
        };

} )( jQuery, window, document );
