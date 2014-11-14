var args = arguments[0] || {};

var file = args.file;
var won = args.won;
var ind = args.ind;

$.prompt.text = "\""+won[0].p1+" and "+won[0].p2+"\" won?";

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

function confirm(){
	var string = JSON.parse(file.read().text);
	
	string['Teams'][ind[0]].wins[0] += 1;
	string['Teams'][ind[0]].wins[1] += 1;
	string['Teams'][ind[1]].wins[1] += 1;
		
	var winners = [];
	for (x in string['Players']){
		if (string['Players'][x].name == won[1].p1 || string['Players'][x].name == won[1].p2)
			string['Players'][x].wins[1] += 1;
		if (string['Players'][x].name == won[0].p1 || string['Players'][x].name == won[0].p2){
			string['Players'][x].wins[0] += 1;
			string['Players'][x].wins[1] += 1;
			winners.push(string['Players'][x]);
		}
	}
	
	if (!file.write(JSON.stringify(string))){
		calert("Error", "Failed to update info");
	}
	closeWindow();
	Ti.App.fireEvent("showStats", {winners: winners, team: string['Teams'][ind[0]]});
}

function calert(t, m){
	var dialog = Ti.UI.createAlertDialog({
	    message: m,
	    ok: 'Ok',
	    title: t
	});
	dialog.show();
}