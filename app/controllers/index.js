var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "FoosTrackerDB.txt");
/*var string = {
	'Teams' : [{
		'p1' : 'Eric',
		'p2' : 'Josh',
		'wins' : '6'
	},{
		'p1' : 'Eric',
		'p2' : 'Rad',
		'wins' : '5'
	},{
		'p1' : 'Josh',
		'p2' : 'Seth',
		'wins' : '4'
	},{
		'p1' : 'Rad',
		'p2' : 'Josh',
		'wins' : [3,0]'
	},{
		'p1' : 'Rad',
		'p2' : 'Seth',
		'wins' : '2'
	},{
		'p1' : 'Eric',
		'p2' : 'Seth',
		'wins' : '1'
	}],
	'Players' : [{
		'name' : 'Josh',
		'wins' : '7'
	},{
		'name' : 'Rad',
		'wins' : '7'
	},{
		'name' : 'Seth',
		'wins' : '7'
	},{
		'name' : 'Eric',
		'wins' : '7'
	},{
		'name' : 'Jon',
		'wins' : '3'
	},{
		'name' : 'Wilson',
		'wins' : '2'
	}
]};*/
if (!file.exists()){
	var string = { 'Players': [], 'Teams': [] };
	file.write(JSON.stringify(string));
} else {
	var string = JSON.parse(file.read().text);
}

var teams = [];
var selected = [];
var checked = 0;
$.win1.statusBarStyle = Ti.UI.iPhone.StatusBar.LIGHT_CONTENT;

$.win1.open();

var startupAnimation = Titanium.UI.createAnimation({
    opacity: 1,
    duration: 1000,
    delay: 500
});
var startupAnimationBack = Titanium.UI.createAnimation({
    opacity: 0.6,
    duration: 750
});
$.back.animate(startupAnimationBack);
$.topbar.animate(startupAnimation);
$.win2.animate(startupAnimation);

function drawTable() {
	//string = JSON.parse(Ti.App.Properties.getString('Data'));
	string = JSON.parse(file.read().text);
	var arr = [];
	for (x in string['Players'] ) {
		arr.push(Alloy.createController('row', {
			name : string['Players'][x].name,
			wins : string['Players'][x].wins,
			selected : 0,
			backgroundColor : '#163318'
		}).getView());
		for (y in selected){
			if (selected[y].name == arr[arr.length-1].name){
				selected[y].wins = string['Players'][x].wins;
				arr[arr.length-1].selected = 1;
				arr[arr.length-1].backgroundColor = '#326636';
			}
		}
	}
	$.table.setData(arr);
}

function rowClick(e) {
	if (!e.row.selected) {
		if (checked < 4) {
			e.row.backgroundColor = '#326636';
			e.row.selected = 1;
			checked++;
			selected.push(e.row);
		}
	} else {
		e.row.backgroundColor = '#163318';
		e.row.selected = 0;
		checked--;
		for (x in selected){
			if ( e.row.name == selected[x].name){
				selected.splice(x,1);
			}
		}
	}
		
	if (checked == 4)
		$.generate.opacity = 1.0;
	else
		$.generate.opacity = 0.5;
		
	if (checked > 0 && checked < 3)
		$.stats.opacity = 1.0;
	else
		$.stats.opacity = 0.5;
			
}

function clearSelected() {
	if ($.table.data[0] == null)
		return;
	var rows = $.table.data[0].rows;
	for (x in rows ) {
		rows[x].selected = 0;
		rows[x].backgroundColor = '#163318';
	}
	selected = [];
	checked = 0;
	$.generate.opacity = 0.5;
	
	$.bindiv1.title = "";
	$.bindiv2.title = "";
	$.bteams1.title = "";
	$.bteams2.title = "";
	$.rteams1.title = "";
	$.rteams2.title = "";
	
	lastGen = [];
	
	$.bindiv1.backgroundColor = '#163318';
	$.bindiv2.backgroundColor = '#163318';
	$.bteams1.backgroundColor = '#163318';
	$.bteams2.backgroundColor = '#163318';
	$.rteams1.backgroundColor = '#163318';
	$.rteams2.backgroundColor = '#163318';
}

function genTeams(e) {	
	// Set up arrays
	if (checked < 4)
		return;
	if ($.table.data[0] == null)
		return;
	var max = Math.max(selected[0].wins[0]/selected[0].wins[1], selected[1].wins[0]/selected[1].wins[1], selected[2].wins[0]/selected[2].wins[1], selected[3].wins[0]/selected[3].wins[1]);
	var min = Math.min(selected[0].wins[0]/selected[0].wins[1], selected[1].wins[0]/selected[1].wins[1], selected[2].wins[0]/selected[2].wins[1], selected[3].wins[0]/selected[3].wins[1]);
	var tops = [];
	var mids = [];
	var bottoms = [];
	for (x in selected ) {
		if ((selected[x].wins[0]/selected[x].wins[1]) == max)
			tops.push(selected[x]);
		else if ((selected[x].wins[0]/selected[x].wins[1]) == min)
			bottoms.push(selected[x]);
		else
			mids.push(selected[x]);
	}

	// Create Balanced Team From Individual Wins
	if (tops.length == 1 && bottoms.length == 1) {
		teams[0] = tops[0].name;
		teams[1] = bottoms[0].name;
		teams[2] = mids[0].name;
		teams[3] = mids[1].name;
	} else if (tops.length == 4) {
		var shufTops = shuffle(tops);
		teams[0] = shufTops[0].name;
		teams[1] = shufTops[1].name;
		teams[2] = shufTops[2].name;
		teams[3] = shufTops[3].name;
	} else if (mids.length == 4) {
		var shufMids = shuffle(mids);
		teams[0] = shufMids[0].name;
		teams[1] = shufMids[1].name;
		teams[2] = shufMids[2].name;
		teams[3] = shufMids[3].name;
	} else {
		var numw = -1;
		for (t in tops ) {
			for (b in bottoms ) {
				var cur = findTeam(tops[t].name, bottoms[b].name);
				if (cur.wins[0]/cur.wins[1] <= numw)
					continue;
				numw = cur.wins[0]/cur.wins[1];
				teams[0] = cur.p1;
				teams[1] = cur.p2;
				teams[2] = null;
				for (x in selected) {
					if (teams[0] == selected[x].name || teams[1] == selected[x].name)
						continue;
					if (teams[2] == null)
						teams[2] = selected[x].name;
					else
						teams[3] = selected[x].name;
				}
			}
		}
	}
	
	// Create Balanced Team From Team Wins
	var wins = [];
	for (var x=0; x < 4; x++){
		for ( var i=x+1; i < 4; i++){
			wins.push(findTeam(selected[x].name, selected[i].name));
		}
	}
	var lowest = Math.min(Math.abs((wins[0].wins[0]/wins[0].wins[1])-(wins[5].wins[0]/wins[5].wins[1])),
		Math.abs((wins[1].wins[0]/wins[1].wins[1])-(wins[4].wins[0]/wins[4].wins[1])),
		Math.abs((wins[2].wins[0]/wins[2].wins[1])-(wins[3].wins[0]/wins[3].wins[1])) 
	);
	switch (lowest){
		case Math.abs((wins[0].wins[0]/wins[0].wins[1])-(wins[5].wins[0]/wins[5].wins[1])):
			teams[4] = wins[0].p1;
			teams[5] = wins[0].p2;
			teams[6] = wins[5].p1;
			teams[7] = wins[5].p2;
			break;
		case Math.abs((wins[1].wins[0]/wins[1].wins[1])-(wins[4].wins[0]/wins[4].wins[1])):
			teams[4] = wins[1].p1;
			teams[5] = wins[1].p2;
			teams[6] = wins[4].p1;
			teams[7] = wins[4].p2;
			break;
		case Math.abs((wins[2].wins[0]/wins[2].wins[1])-(wins[3].wins[0]/wins[3].wins[1])):
			teams[4] = wins[2].p1;
			teams[5] = wins[2].p2;
			teams[6] = wins[3].p1;
			teams[7] = wins[3].p2;
			break;
		default:
			teams[4] = wins[0].p1;
			teams[5] = wins[0].p2;
			teams[6] = wins[5].p1;
			teams[7] = wins[5].p2;
			break;
	}

	// Create Random Teams
	var random = shuffle(selected);
	teams[8] = random[0].name; teams[9] = random[1].name; teams[10] = random[2].name; teams[11] = random[3].name;
	
	$.bindiv1.title = teams[0]+", "+teams[1];
	$.bindiv2.title = teams[2]+", "+teams[3];
	$.bteams1.title = teams[4]+", "+teams[5];
	$.bteams2.title = teams[6]+", "+teams[7];
	$.rteams1.title = teams[8]+", "+teams[9];
	$.rteams2.title = teams[10]+", "+teams[11];
	
	$.bindiv1.backgroundColor = '#215525';
	$.bindiv2.backgroundColor = '#215525';
	$.bteams1.backgroundColor = '#215525';
	$.bteams2.backgroundColor = '#215525';
	$.rteams1.backgroundColor = '#215525';
	$.rteams2.backgroundColor = '#215525';
	
	return teams;
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	var arr = array.slice();

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = arr[currentIndex];
		arr[currentIndex] = arr[randomIndex];
		arr[randomIndex] = temporaryValue;
	}

	return arr;
}

function findTeam(player1, player2) {
	var poss = string['Teams'].filter(function(obj) {return obj.p1 == player1;}).filter(function(obj) {return obj.p2 == player2;});
	var poss2 = string['Teams'].filter(function(obj) {return obj.p2 == player1;}).filter(function(obj) {return obj.p1 == player2;});
	var team = poss;
	if ( team[0] == null)
		team = poss2;
	else
		return team[0];
		
	var len = string['Teams'].length;
	if (team[0] == null) {
		string['Teams'][len] = {
			'p1' : player1,
			'p2' : player2,
			'wins' : [0,0]
		};
		saveInfo();
		return string['Teams'][len];
	}
		
	return team[0];
}

function setWin(e) {
	if (e.source.title == "")
		return;
	
	var won = [];
	var ind = [];
	
	var players = e.source.title.split(", ");
	won[0] = findTeam(players[0], players[1]);
	ind[0] = string['Teams'].indexOf(won[0]);
	
	for (var i=0; i<4; i++){
		if (players[0] == teams[i] || players[1] == teams[i])
			continue;
			
		if (players[2] == null)
			players[2] = teams[i];
		else
			players[3] = teams[i];
	}
	won[1] = findTeam(players[2], players[3]);
	ind[1] = string['Teams'].indexOf(won[1]);
	
	var win = Alloy.createController('win', {
		file : file,
		won : won,
		ind : ind,
	}).getView();
	win.open();	
}

function options() {
	var players = "";
	if ($.table.data[0] != null){
		for (x in selected) {
			if (players == "")
				players = selected[x].name;
			else
				players = players+", "+selected[x].name;
		}
	}
	
	var options = Alloy.createController('options', {
		file : file,
		players : players
	}).getView();
	options.open();
}

function stats(e, t, w) {
	if (checked != 1 && checked != 2 && t == null && w == null)
		return;
	
	var team = [];
	var players = selected;
	
	if (t == null && w == null) {
		if (players.length == 2)
			team = findTeam(players[0].name, players[1].name);
	} else {
		team = t;
		players = w;
	}
	
	var stat = Alloy.createController('stats', {
		selected : players,
		team : team
	}).getView();
	stat.open();	
}

function saveInfo() {
	if (!file.write(JSON.stringify(string))){
		calert("Error", "Failed to update info");
	}
}

function calert(t, m){
	var dialog = Ti.UI.createAlertDialog({
	    message: m,
	    ok: 'Ok',
	    title: t
	});
	dialog.show();
}

Ti.App.addEventListener('clear', function(event) {
 	clearSelected();
});

Ti.App.addEventListener('showStats', function(event) {
 	stats("ok", event.team, event.winners);
});