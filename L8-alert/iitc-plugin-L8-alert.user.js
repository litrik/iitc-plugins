// ==UserScript==
// @id             iitc-plugin-l8-alert@agentor
// @name           IITC plugin: L8 Alert
// @version        0.5.20131202
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://github.com/agentor/iitc-plugins/raw/master/L8-alert/iitc-plugin-L8Balert.user.js
// @downloadURL    https://github.com/agentor/iitc-plugins/raw/master/L8-alert/iitc-plugin-L8Balert.user.js
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
window.plugin.portalAlertL8 = function() {};

window.plugin.portalAlertL8.portalAdded = function(data) {
    
    var portal = data.portal.options;

    var portal_level = portal.data.level;
    var portal_guid = portal.guid;
    var portal_guid_html = portal.guid.replace('.','');
    var	portal_address = '';
    var	portal_city = '';
   
    if(portal_level >= 8 && $('#L8_'+portal_guid_html).length == 0) {
       navigator.geolocation.getCurrentPosition(function(position){ 

            lat1 = position.coords.latitude;
            lat2 = portal.data.latE6/1E6;
            lon1 = position.coords.longitude;
            lon2 = portal.data.lngE6/1E6;
            var R = 6371; // km
            var dLat = (lat2-lat1) * Math.PI / 180;
            var dLon = (lon2-lon1) * Math.PI / 180;
            var lat1 = lat1 * Math.PI / 180;
            var lat2 = lat2 * Math.PI / 180;
            
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c;
            $('#L8_'+portal_guid_html+'_distance').text((Math.round(d * 100) / 100).toString()+' km');
            
        }, function(){
            console.log('L8alert: geolocation error');
        });   
        
        
    	var portal_title = portal.data.title;
       
        var team = portal.team;
        var html ='';
        html += '<tr>';
        html += '<td>L'+ Math.floor(portal_level)+'</td><td>('+portal_level	+')</td>';
        html += '<td><a id="L8_'+portal_guid_html+'" class="help" title="'+portal_address+'" ';
        html += ' onclick="window.zoomToAndShowPortal(\''+portal_guid+'\', [' + portal.data.latE6/1E6 + ', ' + portal.data.lngE6/1E6 + ']);return false"';
        html += ' href="/intel?ll=' + portal.data.latE6/1E6 + ',' + portal.data.lngE6/1E6 + '&pll=' + portal.data.latE6/1E6 + ',' + portal.data.lngE6/1E6 + '&z=17"';
        switch (team){
            case 1 :
                html += ' style="color:#0088FF;"';
                break;
            case 2 :
                html += ' style="color:#03DC03;"';
                break;
        }
        html += '>'+portal_title+'</a></td><td>'+portal_city+'</td><td id="L8_'+portal_guid_html+'_distance"></td></tr>';
        $('#chat div#l8_portal_alert table').append(html);
       
        switch (team){
            case 1 :
                window.plugin.portalAlertL8.blinkStateResistance = true;
                window.plugin.portalAlertL8.blinkStateResistance1();
                break;
            case 2 :
                window.plugin.portalAlertL8.blinkStateEnlightened = true;
                window.plugin.portalAlertL8.blinkStateResistance = false;
                window.plugin.portalAlertL8.blinkStateEnlightened1();
                break;
        }
    }
    return false;
}


window.plugin.portalAlertL8.blinkStateEnlightened = false;
window.plugin.portalAlertL8.blinkStateResistance = false;
window.plugin.portalAlertL8.km = '';

window.plugin.portalAlertL8.blinkStateEnlightened1 = function(data) {
	    $('#chatcontrols a#l8_portal_alert_control').css('background-color','red').css('color','white');
    	setTimeout("window.plugin.portalAlertL8.blinkStateEnlightened2()",500);
}

window.plugin.portalAlertL8.blinkStateEnlightened2 = function(data) {
	$('#chatcontrols a#l8_portal_alert_control').css('background-color','transparent').css('color','#ffce00');
    if(window.plugin.portalAlertL8.blinkStateEnlightened === true) {
   	 	setTimeout("window.plugin.portalAlertL8.blinkStateEnlightened1()",500);
    }
}
window.plugin.portalAlertL8.blinkStateResistance1 = function(data) {
	    $('#chatcontrols a#l8_portal_alert_control').css('background-color','#0088FF').css('color','white');
    	setTimeout("window.plugin.portalAlertL8.blinkStateResistance2()",500);
}

window.plugin.portalAlertL8.blinkStateResistance2 = function(data) {
	$('#chatcontrols a#l8_portal_alert_control').css('background-color','transparent').css('color','#ffce00');
    if(window.plugin.portalAlertL8.blinkStateResistance === true && window.plugin.portalAlertL8.blinkStateEnlightened === false) {
   	 	setTimeout("window.plugin.portalAlertL8.blinkStateResistance1()",500);
    }
}

window.plugin.portalAlertL8.portalDataLoaded = function(data) {
  $.each(data.portals, function(ind, portal) {
    if(window.portals[portal[0]]) {
      window.plugin.portalAlertL8.portalAdded({portal: window.portals[portal[0]]});
    }
  });
}

window.plugin.portalAlertL8.displayAlertBox = function(data) {
    $('#chatcontrols a').removeClass('active');
    $('#chatcontrols a#l8_portal_alert_control').addClass('active');
    $('#chat div').css('display','none');
	$('#chat div#l8_portal_alert').css('display','block');   
    
    window.plugin.portalAlertL8.blinkStateResistance = false;
    window.plugin.portalAlertL8.blinkStateEnlightened = false;
}

var setup =  function() {
  window.addHook('portalAdded', window.plugin.portalAlertL8.portalAdded);
 // window.addHook('portalDataLoaded', window.plugin.portalAlertL8.portalDataLoaded);
  window.COLOR_SELECTED_PORTAL = '#f0f';

  $('#chatcontrols').append(' <a id="l8_portal_alert_control" onclick="window.plugin.portalAlertL8.displayAlertBox()">L8 Alert</a>');
  $('#chat').append(' <div id="l8_portal_alert" style="display:none;"><table></table></div>');
 
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
