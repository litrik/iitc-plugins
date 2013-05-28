// ==UserScript==
// @id             iitc-plugin-l7+-alert@agentor
// @name           IITC plugin: L7+ Alert
// @version        0.3.20130425
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// ==/UserScript==

function wrapper() {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};


// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.portalAlert = function() {};

window.plugin.portalAlert.portalAdded = function(data) {
	var d = data.portal.options.details;
    var portal = data.portal;
   
    var portal_level = getPortalLevel(d).toFixed(2);
    var portal_guid = data.portal.options.guid;
    var portal_guid_html = data.portal.options.guid.replace('.','');
    var portal_address = d.portalV2.descriptiveText.ADDRESS;
    var tmp = portal_address.split(',');
    var portal_city = tmp[1];
    
    if(portal_level >= 7 && $('#L7_'+portal_guid_html).length == 0) {
    	var portal_title = d.portalV2.descriptiveText.TITLE;
       
        var team = portal.options.team;
        var html ='';
        html += '<tr>';
        html += '<td>L'+ Math.floor(portal_level)+'</td><td>('+portal_level	+')</td>';
        html += '<td><a id="L7_'+portal_guid_html+'" class="help" title="'+portal_address+'" ';
        html += ' onclick="window.zoomToAndShowPortal(\''+portal_guid+'\', [' + portal._latlng.lat + ', ' + portal._latlng.lng + ']);return false"';
        html += ' href="/intel?latE6=' + portal._latlng.lat*1E6 + '&lngE6=' + portal._latlng.lng*1E6 + '&z=17&pguid='+portal_guid+'"';
        switch (team){
            case 1 :
                html += ' style="color:#0088FF;"';
                break;
            case 2 :
                html += ' style="color:#03DC03;"';
                break;
        }
        html += '>'+portal_title+'</a></td><td>'+portal_city+'</td></tr>';
        $('#chat div#portal_alert table').append(html);
       
        switch (team){
            case 1 :
                window.plugin.portalAlert.blinkStateResistance = true;
                window.plugin.portalAlert.blinkStateResistance1();
                break;
            case 2 :
                window.plugin.portalAlert.blinkStateEnlightened = true;
                window.plugin.portalAlert.blinkStateResistance = false;
                window.plugin.portalAlert.blinkStateEnlightened1();
                break;
        }
    }
    return false;
}

window.plugin.portalAlert.blinkStateEnlightened = false;
window.plugin.portalAlert.blinkStateResistance = false;

window.plugin.portalAlert.blinkStateEnlightened1 = function(data) {
	    $('#chatcontrols a#portal_alert_control').css('background-color','red').css('color','white');
    	setTimeout("window.plugin.portalAlert.blinkStateEnlightened2()",500);
}

window.plugin.portalAlert.blinkStateEnlightened2 = function(data) {
	$('#chatcontrols a#portal_alert_control').css('background-color','transparent').css('color','#ffce00');
    if(window.plugin.portalAlert.blinkStateEnlightened === true) {
   	 	setTimeout("window.plugin.portalAlert.blinkStateEnlightened1()",500);
    }
}
window.plugin.portalAlert.blinkStateResistance1 = function(data) {
	    $('#chatcontrols a#portal_alert_control').css('background-color','#0088FF').css('color','white');
    	setTimeout("window.plugin.portalAlert.blinkStateResistance2()",500);
}

window.plugin.portalAlert.blinkStateResistance2 = function(data) {
	$('#chatcontrols a#portal_alert_control').css('background-color','transparent').css('color','#ffce00');
    if(window.plugin.portalAlert.blinkStateResistance === true && window.plugin.portalAlert.blinkStateEnlightened === false) {
   	 	setTimeout("window.plugin.portalAlert.blinkStateResistance1()",500);
    }
}

window.plugin.portalAlert.portalDataLoaded = function(data) {
  $.each(data.portals, function(ind, portal) {
    if(window.portals[portal[0]]) {
      window.plugin.portalAlert.portalAdded({portal: window.portals[portal[0]]});
    }
  });
}

window.plugin.portalAlert.displayAlertBox = function(data) {
    $('#chatcontrols a').removeClass('active');
    $('#chatcontrols a#portal_alert_control').addClass('active');
    $('#chat div').css('display','none');
	$('#chat div#portal_alert').css('display','block');   
    
    window.plugin.portalAlert.blinkStateResistance = false;
    window.plugin.portalAlert.blinkStateEnlightened = false;
}

var setup =  function() {
  window.addHook('portalAdded', window.plugin.portalAlert.portalAdded);
  window.addHook('portalDataLoaded', window.plugin.portalAlert.portalDataLoaded);
  window.COLOR_SELECTED_PORTAL = '#f0f';

  $('#chatcontrols').append(' <a id="portal_alert_control" onclick="window.plugin.portalAlert.displayAlertBox()">L7+ Alert</a>');
  $('#chat').append(' <div id="portal_alert" style="display:none;"><table></table></div>');
 
}

// PLUGIN END //////////////////////////////////////////////////////////

if(window.iitcLoaded && typeof setup === 'function') {
  setup();
} else {
  if(window.bootPlugins)
    window.bootPlugins.push(setup);
  else
    window.bootPlugins = [setup];
}
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
