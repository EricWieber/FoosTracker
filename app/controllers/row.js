var args = arguments[0] || {};

if (args != {}) {
	$.row.title = args.name;
	$.row.name = args.name;
	$.row.wins = args.wins;
	$.row.selected = args.selected;
	//$.check.visible = args.selected;
}