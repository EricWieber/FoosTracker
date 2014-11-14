var args = arguments[0] || {};

var file = args.file;
var players = args.players;

var startupAnimation = Titanium.UI.createAnimation({
    opacity: 1,
    duration: 250
});
$.options.animate(startupAnimation);

var closeAnimation = Titanium.UI.createAnimation({
    opacity: 0,
    duration: 250
});
closeAnimation.addEventListener('complete', function() {
    $.options.close();
});

function closeWindow() {
	$.options.animate(closeAnimation);
}

function save(){	
	var string = JSON.parse(file.read().text);

	if ($.playerName.value.toLowerCase() == ""){
		calert("Error", "Enter a player name");
		return;
	}
	for (x in string['Players']){
		if ( string['Players'][x].name.toLowerCase() == $.playerName.value.toLowerCase()){
			alert("Player already exists");
			return;
		}
	}
	
	string['Players'][string['Players'].length]={
		'name' : $.playerName.value,
		'wins' : [0,0]
	};
	
	//Ti.App.Properties.setString('Data', JSON.stringify(string) );
	if (!file.write(JSON.stringify(string))){
		calert("Error", "Failed to update info");
	}
	closeWindow();
}

function exportDB() {
	var string = JSON.parse(file.read().text);

	var encoded = JSON.stringify(string);
	encoded = encoded.replace(/\]\,\"Teams\"\:\[/g,"%").replace(
		/\"p1\"\:\"/g,"!").replace(
		/\,\"p2\"\:\"/g,"@").replace(
		/\,\"wins\"\:0/g,"").replace(
		/\,\"wins\"\:/g,"$").replace(	
		/\"Players\"\:\[/g,"&").replace(
		/\"name\"\:\"/g,"#" ).replace(
		/\}\,\{/g,"=");
	for (x in string['Players']){
		var n = new RegExp(string['Players'][x].name+"\"","g");
		encoded = encoded.replace(n,"~"+x)+"|"+string['Players'][x].name;
	}
	Ti.API.log(encoded);
	
	Ti.UI.Clipboard.clearText();
	Ti.UI.Clipboard.setText(encoded);
	
	calert("Database", "Database copied to Clipboard. Email/Text it to share!");
	
	/*var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.subject = "Export of FoosTracker DB";
	emailDialog.toRecipients = [''];
	emailDialog.messageBody = file.toString();
	emailDialog.open();
	
	var smsDialog = Ti.UI.createSMSDialog();
	smsDialog.toRecipients = [''];
	smsDialog.messageBody = file.toString();
	smsDialog.open();*/
}

function importDB() {
	var string = JSON.parse(file.read().text);

	var clip = Ti.UI.Clipboard.getText();
	if (clip == ""){
		calert("Error", "Clipboard must be a Database string");
		return;
	}
	
	
	var decoded = clip.split("|");
	for (x in decoded){
		if (x == 0)
			continue;
		
		var ind = x-1;	
		var n = new RegExp("\\~"+(x-1),"g");
		var w = new RegExp("\\~"+(x-1)+"=","g");
		var w2 = new RegExp("\\~"+(x-1)+"}","g");
		decoded[0] = decoded[0].replace(w2,decoded[x]+"\",\"wins\":0}").replace(
			w,decoded[x]+"\",\"wins\":0=").replace(
			n,decoded[x]);
	}
	decoded[0] = decoded[0].replace(/\%/g, "],\"Teams\":[").replace(
		/\&/g, "\"Players\":[").replace(
		/\!/g, "\"p1\":\"").replace(
		/\@/g, "\",\"p2\":\"").replace(
		/\$/g, "\",\"wins\":").replace(	
		/\#/g, "\"name\":\"" ).replace(
		/\=/g, "},{");//.replace(
		///[a-zA-Z]\}/g, "\",\"wins\":0}");
	Ti.API.log(decoded[0]);
	
	
	var str = JSON.parse(decoded[0]);
	if (str['Teams'] == null || str['Players'].length < 1){
		calert("Error", "Invalid Database string in clipboard");
		return;
	}
	
	string = str;
	if (!file.write(JSON.stringify(string))){
		calert("Error", "Failed to update info");
	}
	
	calert("Database", "Database imported!");
	
	closeWindow();
	Ti.App.fireEvent("clear", {});
}

function calert(t, m){
	var dialog = Ti.UI.createAlertDialog({
	    message: m,
	    ok: 'Ok',
	    title: t
	});
	dialog.show();
}
