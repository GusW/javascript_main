jQuery.extend( jQuery.fn.dataTableExt.oSort, {
	"numeric-comma-brl-pre": function ( a ) {
		var x = (a == "-") ? 0 : a.replace("R$ ","").replace(".","").replace( /,/, "." );
    return parseFloat( x );
	},

	"numeric-comma-brl-asc": function ( a, b ) {
		return ((a < b) ? -1 : ((a > b) ? 1 : 0));
	},

	"numeric-comma-brl-desc": function ( a, b ) {
		return ((a < b) ? 1 : ((a > b) ? -1 : 0));
	}
} );
