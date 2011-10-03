/*!
 *
 * Copyright (C) 2011 by Jonathan Brachthäuser (http://b-studios.de)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
 * associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or 
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHERLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT 
 * OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */
(function($, globals) {

  /**
   * @function $.resolve
   */
  if(typeof $.resolve !== 'function')
    $.resolve = function(name, repair) {
      
      if($.type(name) !== 'string') return name;      

      var curr = globals;
      $.each(name.split('.'), function(i,part) {
        if(curr[part] === undefined && !repair) 
          throw "cannot resolve part '" + part + "' of '" + name + "'";
      
        else if(curr[part] === undefined && !!repair)
          curr[part] = {};

        curr = curr[part];
      });
      return curr;
    };

  /**
   * @function $.clone_without
   * Makes a shallow copy of source without the specified keys
   */    
  if(typeof $.clone_without !== 'function')
    $.clone_without = function(source) {
      var keys = Array.prototype.slice.call(arguments, 1,arguments.length),
          copy = {};
      
      for(var prop in source) {
        if(source.hasOwnProperty(prop) && keys.indexOf(prop) == -1)
          copy[prop] = source[prop];
      }
      return copy;
    };

  /**
   * @function $.define
   */
  if(typeof $.define !== 'function')
    $.define = function(name, obj) {
      var last = name.lastIndexOf('.'),
          scope = globals;
      
      if(last != -1) {
        scope = $.resolve(name.substring(0,last), true);
        name = name.substring(last+1, name.length);
      }
      scope[name] = obj;         
    }

    if(typeof $.sym !== 'function')
      $.sym = (function() {
        
        function symbols(sym) {
          if($.type(sym) === 'string' && symbols[sym] === undefined)
            return symbols[sym] = { toString: function() { return ':' + sym; }};
          else
            return symbols[sym];
        }

        return symbols;
      })();
  

    if(typeof $.create !== 'function') 
      
      /**
       * @function $.create
       *
       * Creates a new class, which can be initialized
       */      
      $.create = function(name, specs) {
        
        // extract information from the class-specification and create constructor
        var klass = $.extend(function() {
          
          if(!!klass.superclass)
            var proto = new klass.superclass($.sym('dont_initialize'));
            
          else
            var proto = Object;  

          var constructor = function(args) {
                  
            var instance = this;
            
            // 1. Apply Mixins
            klass.applyAsMixin(instance);    
            
            // 2. Apply own properties
            $.extend(true, instance, self, {
              klass: constructor,
          
              // add initializeParent to instance
              initParent: function() {
              
                if($.type(proto.initialize) === 'function')
                  proto.initialize.apply(proto, arguments);
              }
            });
               
            // 3. Call initialize (check for global symbol dont_initialize first)
            //    If a constructor is called within the inheritance chain, we don't want
            //    to initialize the class automatically
            if(args[0] !== $.sym('dont_initialize'))          
              self.initialize.apply(instance, args);
          };
          $.extend(constructor, klass, {
            prototype: proto
          });
          
          return new constructor(arguments);
        }, specs.statics);

        var self = {
          initialize: specs.initialize || function() { 
            this.initParent.apply(this, arguments); 
          }
        };
        
        $.extend(klass, {
          
          // Takes a string or an array or undefined and returns an array of resolved mixins
          mixins: $.map(($.type(specs.mixins) === 'string')? [specs.mixins] : specs.mixins || [], 
            function(mixin) { return $.resolve(mixin); }),

          superclass: $.resolve(specs.extend),
          
          toString: function() { return name; },

          applyAsMixin: function(obj) {
            $.extend(true, obj, self);
            
            // if this klass has mixins, they have to be applied recursive
            $.each(klass.mixins, function(i, mixin) {
              if($.type(mixin.applyAsMixin) === 'function')
                mixin.applyAsMixin(obj);
            });
          }
        });
        
        // After saving some properties in klass, delete them from the instance-template
        $.extend(self, $.clone_without(specs, 'initialize', 'mixins', 'extend', 'statics'));

        $.define(name, klass);
      }   

})(jQuery, this);
