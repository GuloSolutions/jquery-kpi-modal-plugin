;( function( $, window, document, undefined ) {
    "use strict";
        // Create the defaults once
        var pluginName = "kpi",
            defaults = {
                engagement: false,
                isCookieSet: false,
                mouseLeave: false,
                pageCounter: 0,
                timeToRead: 0,
                timeToTrigger: 0,
                modalCounter:0
            };

        function Plugin ( element, options ) {
            this.element = element;
            this.settings = $.extend( {}, defaults, options );
            this._defaults = defaults;
            this._name = pluginName;
            this.init();
        }

        //Cookies.remove('buttonmodal');

        if (sessionStorage.getItem("popped") === undefined) {
            var m_trigger = 0;
            sessionStorage.setItem("popped", m_trigger);
        } else {
            var m_trigger = sessionStorage.getItem("popped");
        }

        if (mCounter === undefined){
            var mCounter = 0;
        }

        $.extend( Plugin.prototype, {
            init: function() {
                this.modalCounter();
                this.counter();
                this.isMouseLeave();
                if (this.settings.engagement === true){
                    this.checkWordCount();
                }
            },

            timeOut: function()
            {
                var engagement  = this.settings.engagement;
                var id = this.element.id;

                if (this.settings.isCookieSet === false
                    && engagement === false){
                    window.setTimeout(function(){
                        $('#'+id).modal({
                            fadeDuration: 250
                        });
                    }, 2000);
                }
                m_trigger++;
                sessionStorage.setItem("popped", m_trigger);
            },

            isMouseLeave: function()
            {
                var id = this.element.id;
                var mouseLeave = this.settings.mouseLeave;
                var engagement = this.settings.engagement;
                var trigger = sessionStorage.getItem("popped");

                var checkCookies =  function() {
                    if (Cookies.get('modalpopupcookie') === undefined) {
                        var cval = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                        // set cookie expiration time in 3 days
                        Cookies.set('modalpopupcookie', cval, { expires: 3, path: '/' });
                    }
                };

                var setCookieForPage = function() {
                    var cval = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    Cookies.set('modalpageopened', cval);
                };

                $('body').mouseleave(function(){

                    var activated = $('#coupon-cards');

                    if (engagement === false && trigger <= 2 && mCounter <= 1) {

                        if (activated.length == 0 || activated.css('display') ==  'none') {
                        $('#'+id).modal({
                            fadeDuration: 250
                        });
                        setCookieForPage();
                        m_trigger++;
                        sessionStorage.setItem("popped", m_trigger);
                        checkCookies();
                        }
                    }
                });
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
                    }
                    else if(pageCounter*7 < Math.trunc(timeToRead*(2/3)) ){
                        ('#'+id).modal();
                    }
                };

                setInterval(runCounter, 6000);
                runCounter();
            },

            modalCounter: function(){
                var runModalCounter = function(){
                    if (mCounter == 10) {
                        return;
                    } else {
                        mCounter++;
                        console.log(mCounter);
                    }
                };

                setInterval(runModalCounter, 1000);
                runModalCounter();
            },

            detectButtonActivatedModal: function(){

                var setModalCookie = function() {
                    var cval = Math.random().toString(36).substring(2, 15);
                    Cookies.set('buttonmodal', cval);
                };

                $("#coupon-cards" ).click(function() {
                        console.log( "Goodbye!" );
                        setModalCookie();
                });
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
