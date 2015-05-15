(function ($, window, document, undefined) {

  'use strict';

  var FilterList = function( el, options ){
    this.$el = $(el);

    options = options || FilterList.DEFAULTS;
    for (var k in options) {
      if (!(k in FilterList.DEFAULTS)) options[k] = FilterList.DEFAULTS[k];
    }
    this.options = options;

    this.value  = '';

    this.$input = this.$el.find( this.$el.data('input') );
    this.$items = this.$el.find( this.$el.data('target') );
    this.fields = this.$el.data('fields').split(',');

    this.data   = this.getDataFromItems();

    this.$input.on( this.options.inputListenEvent, this.onInputChange.bind( this ) );

    return this;
  };


  FilterList.DEFAULTS = {
    inputListenEvent: 'keyup'
  };

  FilterList.prototype.getDataFromItems = function() {
    var data = [];
    var this_ = this;

    this.$items.each( function(){
      var $el = $(this);
      var item = { $el: $el };

      this_.fields.forEach( function( field ){
        item[ field ] = $el.data( field );
      });

      data.push( item );
    });

    return data;
  };

  FilterList.prototype.filter = function( input ){
    if ( !input ){
      this.$items.css( 'display', '' );
      return this;
    }

    this.$items.css( 'display', 'none' );

    this._search(
      this.data, input, this.fields
    ).forEach( function( item ){
      item.$el.css( 'display', '' );
    });

    return this;
  };

  FilterList.prototype.onInputChange = function( e ){
    this.filter( e.target.value );
  };

  FilterList.prototype._search = function (list, term, fields) {
    var tokens;
    var normalize = function (val) {
      return val.replace(/\'/g, '').toLowerCase();
    }

    if (typeof term === 'number') {
      tokens = [];
    } else if (typeof term === 'string') {
      term = normalize(term);
      tokens = term.match(/\w+/g);
    } else {
      throw new Error('Invalid search term type');
    }

    return list.filter(function (items) {
      return fields.some(function (field) {
        var value = items[field];

        if (!tokens) return false;
        if (value === undefined) return false;
        if (value === null && term !== null) return false;

        if (typeof term === "number") return value === term;

        if (['string', 'number'].indexOf(typeof value) === -1) return false;
        if (typeof value === 'string') value = normalize(value);

        return tokens.some(function (tokens) {
          return ('' + value).indexOf(tokens) > -1;
        });
      });
    });
  };

  var Plugin = function( options ){
    return this.each(function() {
      var $this = $(this);
      var data = $this.data('gb.filterlist');

      if (!data) {
        data = new FilterList(this, options);
        $this.data('gb.filterlist', data);
      }
    });
  };

  $.fn.gb_filterlist             = Plugin;
  $.fn.gb_filterlist.Constructor = FilterList;

  var old = $.fn.gb_tablelist;

  // NO CONFLICT
  $.fn.gb_filterlist.noConflict = function() {
    $.fn.gb_filterlist = old;
    return this;
  };

  $(function(){
    $('[data-role="filter-list"]').gb_filterlist();
  });

})(jQuery, window, document);
