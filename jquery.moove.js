/*global jQuery */
/*!
 * moove.js 0.1
 *
 * Copyright 2014, Teddy Kishi http://teddyk.be
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 *
 * Date: Wed Jul 02 14:23:00 2014 -0600
 * You can use it to trigger animate.css animations. But you can easily change the settings to your favorite animation library.
 */
(function ($, window) {
    //window.mooveQueue = window.mooveQueue || [];

    $.fn.mooveQueue = $.fn.mooveQueue || [];

    $.fn.moove = function (animationName, options) {
        var self = this, i,
            animations = ['bounce','flash','pulse','rubberBand','shake','swing','tada','wobble',
                          'bounceIn','bounceInDown','bounceInLeft','bounceInRight','bounceInUp',
                          'bounceOut','bounceOutDown','bounceOutLeft','bounceOutRight','bounceOutUp',
                          'fadeIn','fadeInDown','fadeInDownBig','fadeInLeft','fadeInLeftBig','fadeInRight','fadeInRightBig','fadeInUp','fadeInUpBig',
                          'fadeOut','fadeOutDown','fadeOutDownBig','fadeOutLeft','fadeOutLeftBig','fadeOutRight','fadeOutRightBig','fadeOutUp','fadeOutUpBig',
                          'flip','flipInX','flipInY','flipOutX','flipOutY',
                          'lightSpeedIn','lightSpeedOut',
                          'rotateIn','rotateInDownLeft','rotateInDownRight','rotateInUpLeft','rotateInUpRight',
                          'rotateOut','rotateOutDownLeft','rotateOutDownRight','rotateOutUpLeft','rotateOutUpRight',
                          'hinge','rollIn','rollOut',
                          'zoomIn','zoomInDown','zoomInLeft','zoomInRight','zoomInUp',
                          'zoomOut','zoomOutDown','zoomOutLeft','zoomOutRight','zoomOutUp',
                          'slideInDown','slideInLeft','slideInRight','slideInUp',
                          'slideOutDown','slideOutLeft','slideOutRight','slideOutUp'];


        if (options && typeof options == 'object') {
            options = options;
        } else if(typeof animationName == 'object') {
            options = animationName;
        } else {
            options = {};
        }

        if (animationName && typeof animationName == 'string') {
            options.animName = animationName;
            if(animationName == 'random'){
                options.animName = animations[Math.floor(Math.random() * animations.length)];
            }
        } else if (animationName && animationName instanceof Array) {
            for (i = 0; i < animationName.length; i++) {
                if(animationName[i] == 'random'){
                    animationName[i] = animations[Math.floor(Math.random() * animations.length)]
                }
            };
            options.animNames = animationName;
        }

        // This is the easiest way to have default options.
        var animate, i,
            count = 0,
            settings = $.extend({
                // These are the defaults.
                animName: '',
                animClass: "animated",
                queue : false,
                stagger: false,
                animNames: false,
                onStart: function () {},
                onEnd: function () {}
            }, options),

            animateSingle = function () {
                if (settings.stagger) {
                    self.each(function (k, v) {
                        $(this).delay(k * settings.stagger).queue(function () {
                            $(this).removeClass(settings.animName).addClass(settings.animClass + ' ' + settings.animName).dequeue();
                            settings.onStart.call(this, $(this));
                        });
                    });
                } else {
                    self.each(function (k, v) {
                        $(this).removeClass(settings.animName).addClass(settings.animClass + ' ' + settings.animName);
                        settings.onStart.call(this, $(this));
                    })
                }

                self.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).removeClass(settings.animClass).removeClass(settings.animName);
                    settings.onEnd.call(this, $(this));

                    if(settings.queue){
                        if(count == self.length-1){
                            //find where id
                            $.fn.mooveQueue .splice(0, 1);

                            if($.fn.mooveQueue [0] && !$.fn.mooveQueue [0].animating){
                                $.fn.mooveQueue [0].action();
                                $.fn.mooveQueue [0].animating = true;
                                console.log("do next event", $.fn.mooveQueue[0])
                            }
                        }
                    }
                    count++;
                });
            },

            animateArray = function () {
                if (settings.stagger) {
                    self.each(function (k, v) {
                        $(this).delay(k * settings.stagger).queue(function () {
                            var currentAnimationName = settings.animNames[k] || settings.animNames[0];
                            $(this).removeClass(currentAnimationName).addClass(settings.animClass + ' ' + currentAnimationName).dequeue();
                            settings.onStart.call(this, $(this));
                        });
                    });
                } else {
                    self.each(function (k, v) {
                        var currentAnimationName = settings.animNames[k] || settings.animNames[0];
                        $(this).removeClass(currentAnimationName).addClass(settings.animClass + ' ' + currentAnimationName);
                        settings.onStart.call(this, $(this));
                    })
                }

                self.each(function (k, v) {
                    $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                        var currentAnimationName = settings.animNames[k] || settings.animNames[0];
                        $(this).removeClass(settings.animClass).removeClass(currentAnimationName);
                        settings.onEnd.call(this, $(this));
                    });
                })
            }

        /*[TODO] 
        * if an array is given and the length of objects are less than the length of the array 
        * loop trougth the array 
        * or maintain the last animation name
        */

        var myAnim = {
            animating : false,
            action : function(){
                if (settings.animNames) {
                    animate = animateArray;
                } else {
                    animate = animateSingle;
                }

                if (settings.delay && typeof settings.delay == "number") {
                    setTimeout(animate, settings.delay);
                } else {
                    animate();
                }
            }
        }

        if(settings.queue){
            $.fn.mooveQueue.push(myAnim);

            if(!$.fn.mooveQueue[0].animating){
                $.fn.mooveQueue[0].action();
                $.fn.mooveQueue[0].animating = true;
            }
        } else {
            myAnim.action();
        }

        


        return self;
    };

}(jQuery, window));