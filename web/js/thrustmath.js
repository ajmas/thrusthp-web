/**
 * Author: Andre-John Mas
 * 
 * This is a conversion of Barry Hobson's Thrust HP into
 * a cross platform HTML/Javascript combination. Feel free
 * to share and improve.
 */
 
var units = "imperial";

// 
// -- Wing Loading variables
// 

var wingSpan = 0.0;
var rootChord = 0.0;
var tipChord = 0.0;
var avgChord = 0.0;
var weight = 0.0;
var wingArea = 0.0;    
var wingLoading = 0.0;    
var thrustToWeightRatio = 0.0;

var haveAllLoadingData = false;

// 
// -- Static Thrust variables
// 

var propellerDiameter = 0.0;
var propellerPitch = 0.0;
var bladeCount = 0.0;
var rpm = 0.0;
var propellerType;
    
var load = 0.0;
var speed = 0.0;
var horsePower = 0.0;
    
var airDensity = 0.0;
var cf = 0.0;
var thrust = 0.0;

var haveAllThrustData = false;

// 
// -- Other variables
// 

var minRpm = 0;
var maxRpm = 0;
var increment = 0;
var displayedPropType = null;

//
// -- Methods

function readStaticThrustFields() {
   propellerDiameter = parseFloat( document.getElementById("propDiameter").value );
   propellerPitch = parseFloat( document.getElementById("propPitch").value );
   bladeCount = parseInt( document.getElementById("bladeCount").value ) ;
   
   rpm = parseInt( document.getElementById("rpm").value );
   propellerType = parseInt( document.getElementById("propType").value );
   
   load = parseFloat( document.getElementById("load").value );
   speed = parseFloat( document.getElementById("speed").value );
   horsePower = parseFloat( document.getElementById("hp").value );
   
   airDensity = parseFloat( document.getElementById("airDensity").value );   
   cf = parseFloat( document.getElementById("cf").value );
   thrust = parseFloat( document.getElementById("staticThrust").value );
     
}

function readWingLoadingFields() {
   wingSpan = parseFloat( document.getElementById("wingSpan").value );
   rootChord = parseFloat( document.getElementById("rootChord").value );
   tipChord = parseFloat( document.getElementById("tipChord").value );
   
   weight = parseFloat(  document.getElementById("weight").value );
   wingArea = parseFloat( document.getElementById("wingArea").value );
   
   wingLoading = parseFloat( document.getElementById("wingLoading").value );
   thrustToWeightRatio = parseFloat( document.getElementById("thrustToWeightRatio").value );  
}

function calculateStaticThrust () {
   readStaticThrustFields();
   
   if ( propellerDiameter && propellerPitch && bladeCount ) {
	   lLoad = Math.pow(propellerDiameter, 4.0) * propellerPitch;
			
	   if ( bladeCount == 3 ) {
		  lLoad = lLoad * 1.5;
	   } else if ( bladeCount == 4 ) {
		  lLoad = lLoad * 2.0;
	   }        
	   
	   load = lLoad;
	}
	else {
		load = null;		
	}
	
	if ( propellerPitch && rpm ) {
	   speed = propellerPitch  * rpm * 0.000947;
	} 
	else {
		speed = null;
	}
	
	if ( load && rpm ) {
	   horsePower = load * Math.pow( rpm, 3.0) 
					/ ( 1.4 * Math.pow(10, 17.0));
	}
	else {
		horsePower = null;	
	}
	
	if ( rpm && propellerDiameter && airDensity && cf ) {
	   thrust = 0.00000000000283 * Math.pow(rpm, 2.0) 
				* Math.pow(propellerDiameter,4.0) 
				* (airDensity/29.92) * cf;	
	}
	else {
	    thrust = null;
	}	 
	
	document.getElementById("staticThrust").value = thrust;
	document.getElementById("speed").value = speed;
	document.getElementById("hp").value = horsePower;
	document.getElementById("load").value = load;  
}

function calculateWingLoading () {
   readWingLoadingFields();
   
   if ( rootChord && tipChord ) {
        if ( rootChord == tipChord ) {
            avgChord = rootChord;            
        } else {
            diff = rootChord - tipChord;
            diff = diff / 2;
            avgChord = tipChord + diff;           
        }
	}
	else {
		avgChord = null;
	}
	
	if ( wingSpan && avgChord ) {
        wingArea = wingSpan * avgChord;
        wingArea = wingArea / 144; 
        
        wingLoading = (weight * 16) / wingArea;
        
        thrustToWeightRatio = thrust / weight;   
	}
	else {
		wingArea = null;
		wingLoading = null;
		thrustToWeightRatio = null;
	}
	
	document.getElementById("avgChord").value = avgChord;
	document.getElementById("wingArea").value = wingArea;
	document.getElementById("wingLoading").value = wingLoading;
	document.getElementById("thrustToWeightRatio").value = thrustToWeightRatio;	
}


function changePropellerType () {
   value = document.getElementById("propType").value;
   if ( value == "cust" ) {
      document.getElementById("cf").readOnly = false;
	  document.getElementById("cf").className = "";
	  document.getElementById("cf").value = "0.0";
   }
   else {
      document.getElementById("cf").readOnly = true;
	  document.getElementById("cf").className = "readonly";
	  document.getElementById("cf").value = value;
   }
   
   idx = document.getElementById("propType").selectedIndex
   value = document.getElementById("propType")[idx].innerHTML;
   document.getElementById("displayedPropType").value = value;
   
}

function hide ( id ) {
   elem = document.getElementById(id);
   elem.style.display = 'none';
}

function show ( id ) {
   elem = document.getElementById(id);
   elem.style.display = 'block';
}

function init () {
   hide('wingLoadingDiv');
   hide('reportDiv');
   changePropellerType(); 
   calculateStaticThrust();
   calculateWingLoading();
}