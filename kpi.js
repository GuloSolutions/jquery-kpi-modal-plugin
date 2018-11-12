;( function( $, window, document, undefined ) {

    "use strict";
        // Create the defaults once
        var pluginName = "kpi",
            defaults = {
                engagement: false,
                isCookieSet: false,
                mouseLeave: false,
                pageCounter: 0,
                timeToRead: 0
            };

        function Plugin ( element, options ) {
            this.element = element;
            this.settings = $.extend( {}, defaults, options );
            this._defaults = defaults;
            this._name = pluginName;
            this.init();
        }

        $.extend( Plugin.prototype, {
            init: function() {
                this.checkCookies();
                this.isMouseLeave();
                this.timeOut();
                this.counter();
                this.checkWordCount();
            },
            checkCookies: function( ) {
                // check cookies
                if (Cookies.get('modalpopupcookie') === undefined) {
                    var cval = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    // set cookie expiration time in 3 days
                    Cookies.set('modalpopupcookie', cval, { expires: 3, path: '' });
                } else {
                    this.settings.isCookieSet = true;
                }
            },

            // set default timeout for engagement false
            timeOut: function()
            {
                var engagement  = this.settings.engagement;
                var id = this.element.id;

                if (this.settings.isCookieSet === false
                    && engagement === false){
                    window.setTimeout(function(){
                        $('#'+id).modal();
                    }, 2000);
                }
                this.settings.isCookieSet = true;
            },

            isMouseLeave: function()
            {
                var mouseLeave = this.settings.mouseLeave;
                var engagement = this.settings.engagement;
                var isCookieSet = this.settings.isCookieSet;

                var id = this.element.id;

                $('body').mouseleave(function(){
                    if (mouseLeave === false && engagement === false && isCookieSet === false) {
                        $('#'+id).modal();
                        mouseLeave = true;
                    }
                });
                    this.settings.mouseLeave = mouseLeave;
            },

            counter: function ()
            {
                var pageCounter = this.settings.pageCounter;
                var id = this.element.id;
                var isCookieSet = this.settings.isCookieSet;
                var timeToRead = this.settings.timeToRead;

                var runCounter = function(){
                    if (pageCounter == 10) {
                        clearInterval(this);
                    }
                    else {
                         checkConditions();
                    }
                };
                // engagement is true
                var checkConditions = function () {
                    if (pageCounter >= 7 && isCookieSet !== true){
                        $('#'+id).modal();
                    } else if(pageCounter*7 > 0.66*(timeToRead)){
                        ('#'+id).modal();
                    }
                };

                setInterval(runCounter, 7000);
                runCounter();
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
                } else {
                }
            },
        } );

        $.fn[ pluginName ] = function( options ) {
            return this.each( function() {
                if ( !$.data( this, "plugin_" + pluginName ) ) {
                    $.data( this, "plugin_" +
                        pluginName, new Plugin( this, options ) );
                }
            } );
        };

} )( jQuery, window, document );
