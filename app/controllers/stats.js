var args = arguments[0] || {};

var selected = args.selected;
var team = args.team;

// Set label text with player data
if (selected.length == 1) {
	$.p1prompt.text = selected[0].name+": "+selected[0].wins[0];
	$.p1text.text = ((selected[0].wins[0]/selected[0].wins[1])*100).toFixed(2)+"%";
	$.p2prompt.visible = false;
	//$.p2ratio.visible = false;
	$.tprompt.visible = false;
	//$.tratio.visible = false;
	$.lbl.top = "15%";
	$.confirm.top = "-20%";
} else {
	$.p1prompt.text = selected[0].name+": "+selected[0].wins[0]+" / "+selected[0].wins[1];
	$.p1text.text = ((selected[0].wins[0]/selected[0].wins[1])*100).toFixed(2)+"%";
	$.p2prompt.text = selected[1].name+": "+selected[1].wins[0]+" / "+selected[1].wins[1];
	$.p2text.text = ((selected[1].wins[0]/selected[1].wins[1])*100).toFixed(2)+"%";
	$.tprompt.text = "\nTeam wins: "+team.wins[0]+" / "+team.wins[1];
	$.ttext.text = ((team.wins[0]/team.wins[1])*100).toFixed(2)+"%";
}

// Animations
var startupAnimation = Titanium.UI.createAnimation({
    opacity: 1,
    duration: 250
});
$.win.animate(startupAnimation);

var closeAnimation = Titanium.UI.createAnimation({
    opacity: 0,
    duration: 250
});
closeAnimation.addEventListener('complete', function() {
    $.win.close();
});

function closeWindow() {
	$.win.animate(closeAnimation);
}

function calert(t, m){
	var dialog = Ti.UI.createAlertDialog({
	    message: m,
	    ok: 'Ok',
	    title: t
	});
	dialog.show();
}